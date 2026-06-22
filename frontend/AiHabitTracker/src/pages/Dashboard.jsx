import { useEffect, useMemo, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import api from "../api/axios.js";
import Modal from "../components/Modal.jsx";
import HabitForm from "../components/HabitForm.jsx";
import TodayHabitCard from "../components/TodayHabitCard.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import MorningMotivation from "../components/MorningMotivation.jsx";
import HabitSuggestionModal from "../components/HabitSuggestionModal.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
// import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
 
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [suggestOpen, setSuggestOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  // const [recoveryHabit, setRecoveryHabit] = useState(null);

const greetings = [
  "Hello",
  "Hola",
  "Bonjour",
];

const [index, setIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setIndex((prev) => (prev + 1) % greetings.length);
  }, 2000);

  return () => clearInterval(interval);
}, []);
  

  const loadAll = async () => {
  setLoading(true);

  try {
    const habitsRes = await api.get("/habits");
    setHabits(habitsRes.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadAll();
  }, []);

 const completedToday = useMemo(
  () =>
    new Set(
      habits
        .filter((h) => h.completed)
        .map((h) => String(h._id))
    ),
  [habits]
);


  const streaksById = useMemo(() => {
  const out = {};

  habits.forEach((h) => {
    out[h._id] = {
      current: h.streak || 0,
      longest: h.streak || 0,
    };
  });

  return out;
}, [habits]);

  const todayProgress = habits.length
    ? Math.round((completedToday.size / habits.length) * 100)
    : 0;

  const activeStreaks = habits.filter(
  (h) => h.completed
).length;

  const bestStreak = Math.max(
  0,
  ...habits.map((h) => h.streak || 0)
);

  
const toggle = async (habit) => {
  try {
    const res = await api.put(
      `/habits/${habit._id}`
    );

    setHabits((prev) =>
      prev.map((h) =>
        h._id === habit._id ? res.data : h
      )
    );
  } catch (error) {
    console.log(error);
  }
};


  const saveHabit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        const res = await api.put(`/habits/${editing._id}`, data);
        setHabits((hs) => hs.map((h) => (h._id === res.data._id ? res.data : h)));
      } else {
        const res = await api.post("/habits", data);
        setHabits((hs) => [...hs, res.data]);
      }
      setFormOpen(false);
      setEditing(null);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteHabit = async (habit) => {
    await api.delete(`/habits/${habit._id}`);
    setHabits((hs) => hs.filter((h) => h._id !== habit._id));
    setDeleteTarget(null);
  };

  const archiveHabit = async (habit) => {
    const res = await api.put(`/habits/${habit._id}/archive`);
    if (res.data.isArchived)
      setHabits((hs) => hs.filter((h) => h._id !== habit._id));
    else setHabits((hs) => hs.map((h) => (h._id === res.data._id ? res.data : h)));
  };

  const acceptSuggestion = async (s) => {
    const res = await api.post("/habits", {
      name: s.name,
      description: s.description,
      category: s.category,
      frequency: s.frequency,
      icon: s.icon,
      targetDays: s.frequency === "daily" ? 7 : 3,
    });
    setHabits((hs) => [...hs, res.data])
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
         <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
         {greetings[index]} {user?.name?.split(" ")[0]} 👋
        </h1>

          

          <p className="text-sm text-muted mt-0.5">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-secondary"
            onClick={() => setSuggestOpen(true)}
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Suggest a habit</span>
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus size={14} />
            New habit
          </button>
        </div>
      </div>

      <MorningMotivation />
          
  
  <SummaryCards
  totalHabits={habits.length}
  activeStreaks={activeStreaks}
  bestStreak={bestStreak}
  weekRate={todayProgress}
/>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium">Today's habits</div>
            <div className="text-xs text-muted">
              {completedToday.size} of {habits.length} complete
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <ProgressRing value={todayProgress} size={52} stroke={5} />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                {todayProgress}%
              </div>
            </div>
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">🎯</div>
            <div className="font-medium">Let's build your first habit</div>
            <div className="text-sm text-muted mt-1">
              Start small — something you can do in under 5 minutes.
            </div>
            <button
              className="btn-primary mt-4"
              onClick={() => setFormOpen(true)}
            >
              <Plus size={14} />
              Create habit
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {habits.map((h) => (
              <TodayHabitCard
                key={h._id}
                habit={h}
                completed={h.completed}
                streak={streaksById[h._id]?.current || 0}
                onToggle={() => toggle(h)}
                onEdit={() => {
                  setEditing(h);
                  setFormOpen(true);
                }}
                onArchive={() => archiveHabit(h)}
                onDelete={() => setDeleteTarget(h)}
              />
            ))}
          </div>
        )}
      </div>

      {/* <AIWeeklyReport /> */}

   {/* Weekly Grid & Heatmap disabled for Option A */}

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit habit" : "New habit"}
      >
        <HabitForm
          initial={editing}
          submitting={submitting}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={saveHabit}
        />
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete habit?"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-soft">
          This will permanently delete <b>{deleteTarget?.name}</b> and all its
          history. This can't be undone.
        </p>
        <div className="flex justify-end gap-2 mt-5">
          <button
            className="btn-secondary"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white hover:brightness-110 shadow-lg shadow-rose-500/30 transition"
            onClick={() => deleteHabit(deleteTarget)}
          >
            Delete
          </button>
        </div>
      </Modal>

      <HabitSuggestionModal
        open={suggestOpen}
        onClose={() => setSuggestOpen(false)}
        onAccept={acceptSuggestion}
      />
    </div>
  );
}
