import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Colors, Spacing, FontSize, Radius } from "../../constants/theme";
import { useTaskStore } from "../../store/useTaskStore";
import { filterTasks, FilterType, Task } from "../../lib/tasks";
import { BadgeCheck, Pencil, Trash } from "lucide-react-native"

export default function TasksScreen() {
  const { tasks, addTask, editTask, toggleTask, deleteTask } = useTaskStore();
  const [filter, setFilter] = useState<FilterType>("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [noteInput, setNoteInput] = useState("");

  const filtered = filterTasks(tasks, filter);

  function openAdd() {
    setEditingTask(null);
    setTitleInput("");
    setNoteInput("");
    setModalVisible(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setTitleInput(task.title);
    setNoteInput(task.note ?? "");
    setModalVisible(true);
  }

  function handleSave() {
    if (!titleInput.trim()) return;
    if (editingTask) {
      editTask(
        editingTask.id,
        titleInput.trim(),
        noteInput.trim() || undefined,
      );
    } else {
      addTask(titleInput.trim(), noteInput.trim() || undefined);
    }
    setModalVisible(false);
  }

  function handleToggle(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTask(id);
  }

  function handleDelete(id: string) {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTask(id) },
    ]);
  }

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    done: tasks.filter((t) => t.completed).length,
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Tasks</Text>
          <TouchableOpacity style={s.addBtn} onPress={openAdd}>
            <Text style={s.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Bar */}
        <View style={s.filterBar}>
          {(["all", "active", "done"] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[s.filterBtn, filter === f && s.filterBtnActive]}
            >
              <Text style={[s.filterText, filter === f && s.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task List */}
        <ScrollView
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 && (
            <View style={s.empty}>
              <Text style={s.emptyText}>No tasks here yet.</Text>
            </View>
          )}
          {filtered.map((task) => (
            <View key={task.id} style={s.taskCard}>
              <TouchableOpacity
                onPress={() => handleToggle(task.id)}
                style={s.checkbox}
              >
                <View
                  style={[s.checkboxInner, task.completed && s.checkboxDone]}
                >
                  {task.completed && (
                    <BadgeCheck size={16} color={Colors.inkPrimary} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={s.taskContent}>
                <Text style={[s.taskTitle, task.completed && s.taskTitleDone]}>
                  {task.title}
                </Text>
                {task.note ? (
                  <Text style={s.taskNote} numberOfLines={1}>
                    {task.note}
                  </Text>
                ) : null}
              </View>
              <View style={s.taskActions}>
                <TouchableOpacity
                  onPress={() => openEdit(task)}
                  style={s.actionBtn}
                >
                  <Pencil size={16} color={Colors.inkPrimary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(task.id)}
                  style={s.actionBtn}
                >
                  <Trash size={16} color={Colors.inkPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={s.modalOverlay}>
            <View style={s.modalCard}>
              <Text style={s.modalTitle}>
                {editingTask ? "Edit Task" : "New Task"}
              </Text>
              <TextInput
                style={s.modalInput}
                placeholder="Task title"
                placeholderTextColor={Colors.inkMuted}
                value={titleInput}
                onChangeText={setTitleInput}
                autoFocus
              />
              <TextInput
                style={[s.modalInput, s.modalNote]}
                placeholder="Note (optional)"
                placeholderTextColor={Colors.inkMuted}
                value={noteInput}
                onChangeText={setNoteInput}
                multiline
              />
              <View style={s.modalActions}>
                <TouchableOpacity
                  style={s.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={s.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
                  <Text style={s.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, padding: Spacing.md, gap: Spacing.md },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: Colors.inkPrimary, fontSize: FontSize.xl, fontWeight: "700" },
  addBtn: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  addBtnText: {
    color: Colors.inkPrimary,
    fontSize: FontSize.sm,
    fontWeight: "700",
  },
  filterBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: "center",
  },
  filterBtnActive: { backgroundColor: Colors.brand },
  filterText: {
    color: Colors.inkMuted,
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
  filterTextActive: { color: Colors.inkPrimary },
  list: { gap: Spacing.sm, paddingBottom: Spacing.xl },
  empty: { alignItems: "center", paddingTop: Spacing.xl },
  emptyText: { color: Colors.inkMuted, fontSize: FontSize.md },
  taskCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  checkbox: { padding: 2 },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  checkmark: { color: Colors.inkPrimary, fontSize: 12, fontWeight: "700" },
  taskContent: { flex: 1 },
  taskTitle: {
    color: Colors.inkPrimary,
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  taskTitleDone: { color: Colors.inkMuted, textDecorationLine: "line-through" },
  taskNote: { color: Colors.inkMuted, fontSize: FontSize.sm, marginTop: 2 },
  taskActions: { flexDirection: "row", gap: Spacing.sm },
  actionBtn: { padding: Spacing.xs },
  editText: { color: Colors.inkSecondary, fontSize: FontSize.md },
  deleteText: { color: Colors.danger, fontSize: FontSize.md },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    color: Colors.inkPrimary,
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  modalInput: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.inkPrimary,
    fontSize: FontSize.md,
    padding: Spacing.md,
  },
  modalNote: { minHeight: 80, textAlignVertical: "top" },
  modalActions: { flexDirection: "row", gap: Spacing.sm },
  cancelBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceRaised,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelText: { color: Colors.inkSecondary, fontWeight: "600" },
  saveBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.brand,
    alignItems: "center",
  },
  saveText: { color: Colors.inkPrimary, fontWeight: "700" },
});
