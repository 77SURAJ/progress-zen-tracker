import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { ProgressEntry3D } from './ProgressEntry3D';
import { FloatingAddButton } from './FloatingAddButton';
import { ProgressEntryForm } from './ProgressEntryForm';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter } from 'lucide-react';
import { ProgressSphere } from './ProgressSphere';
import { ParticlesCelebration } from './ParticlesCelebration';

interface ProgressEntry {
  id: string;
  title: string;
  description?: string;
  category: string;
  progress_percentage: number;
  completed: boolean;
  entry_date: string;
  created_at: string;
}

export function ProgressDashboard() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [average, setAverage] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const { user } = useAuth();

  const fetchEntries = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('progress_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  useEffect(() => {
    let filtered = entries;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(entry => entry.category === filterCategory);
    }

    if (filterStatus === 'completed') {
      filtered = filtered.filter(entry => entry.completed);
    } else if (filterStatus === 'in-progress') {
      filtered = filtered.filter(entry => !entry.completed);
    }

    setFilteredEntries(filtered);
  }, [entries, filterCategory, filterStatus]);

useEffect(() => {
  if (entries.length === 0) { setAverage(0); return; }
  const avg = entries.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / entries.length;
  setAverage(avg);
}, [entries]);

useEffect(() => {
  if (!user) return;
  const channel = supabase
    .channel('progress_entries-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'progress_entries', filter: `user_id=eq.${user.id}` }, (payload) => {
      // @ts-ignore
      const row = (payload.new as any) || (payload.old as any);
      if (!row) return;
      const p = row.progress_percentage ?? 0;
      const completed = row.completed ?? false;
      if (completed || p >= 80) setCelebrate(true);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, [user]);

const categories = Array.from(new Set(entries.map(entry => entry.category)));

  return (
    <section 
      className="space-y-6"
      itemScope
      itemType="https://schema.org/ItemList"
      aria-label="Progress Entries Dashboard"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Your Progress Journey
          </h2>
          <p className="text-muted-foreground mt-1" itemProp="description">
            Track and visualize your daily achievements in 3D
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <ProgressSphere value={average} />
        <div className="rounded-xl border border-border p-6 bg-card/40">
          <h3 className="text-lg font-semibold mb-2">Live Animations</h3>
          <p className="text-muted-foreground text-sm">
            Achievements will trigger celebratory particles automatically.
          </p>
        </div>
      </motion.div>

      {/* Progress Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="h-64 bg-card/50 rounded-lg animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      ) : filteredEntries.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -5 }}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/CreativeWork"
              >
                <ProgressEntry3D
                  title={entry.title}
                  description={entry.description}
                  category={entry.category}
                  progress={entry.progress_percentage}
                  completed={entry.completed}
                  date={entry.entry_date}
                  onClick={() => {
                    // Could open entry details modal
                    console.log('Entry clicked:', entry.id);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">No progress entries yet</h3>
          <p className="text-muted-foreground mb-6">
            Start your journey by adding your first progress entry!
          </p>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add First Entry
          </Button>
        </motion.div>
      )}

      {/* Floating Add Button */}
      {filteredEntries.length > 0 && (
        <FloatingAddButton 
          onAddEntry={() => setShowForm(true)}
          className="fixed bottom-8 right-8 z-50"
        />
      )}

      {/* Add Entry Form */}
      <ProgressEntryForm
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={fetchEntries}
      />

      <ParticlesCelebration active={celebrate} onComplete={() => setCelebrate(false)} />
    </section>
  );
}
