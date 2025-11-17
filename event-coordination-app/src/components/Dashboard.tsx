import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Calendar } from 'lucide-react'

type EventItem = {
  id: number
  title: string
  description?: string
  date?: string
  time?: string
  location?: string
  completed?: boolean
}

export default function Dashboard({ session }: any) {
  const [events, setEvents] = useState<EventItem[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('id', { ascending: false })
    if (error) alert(error.message)
    else setEvents(data as EventItem[])
    setLoading(false)
  }

  async function addOrUpdateEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!title) return alert('Title required')
    setLoading(true)

    if (editId) {
      // Update existing event
      const { error } = await supabase
        .from('events')
        .update({ title, description, date, time, location })
        .eq('id', editId)
      if (error) alert(error.message)
      else {
        setEditId(null)
        clearForm()
        fetchEvents()
      }
    } else {
      // ✅ Get current user first
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        alert('User not found. Please log in again.')
        setLoading(false)
        return
      }

      // ✅ Insert event with user_id
      const { error } = await supabase.from('events').insert([
        {
          title,
          description,
          date,
          time,
          location,
          completed: false,
          user_id: user.id, // 👈 important for RLS
        },
      ])

      if (error) alert(error.message)
      else {
        clearForm()
        fetchEvents()
      }
    }

    setLoading(false)
  }

  function clearForm() {
    setTitle('')
    setDescription('')
    setDate('')
    setTime('')
    setLocation('')
  }

  async function deleteEvent(id: number) {
    if (!confirm('Delete this event?')) return
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) alert(error.message)
    else fetchEvents()
  }

  async function toggleComplete(id: number, completed: boolean) {
    const { error } = await supabase
      .from('events')
      .update({ completed: !completed })
      .eq('id', id)
    if (error) alert(error.message)
    else fetchEvents()
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="text-blue-400" /> My Events
        </h2>
        <div>
          <span className="mr-4 text-sm">Signed in</span>
          <button
            onClick={signOut}
            className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add or Edit Form */}
      <form
        onSubmit={addOrUpdateEvent}
        className="bg-slate-800 p-4 rounded space-y-3"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="w-full p-2 rounded bg-slate-700"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full p-2 rounded bg-slate-700"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 rounded bg-slate-700 w-full"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-2 rounded bg-slate-700 w-full"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="p-2 rounded bg-slate-700 w-full"
          />
        </div>
        <div>
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
            {editId ? 'Update Event' : 'Add Event'}
          </button>
        </div>
      </form>

      {/* Events List */}
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul className="space-y-3">
            {events.map((ev) => (
              <li
                key={ev.id}
                className="bg-slate-800 p-3 rounded flex justify-between items-start"
              >
                <div
                  className={`flex-1 ${
                    ev.completed ? 'opacity-60 line-through' : ''
                  }`}
                >
                  <div className="font-semibold text-lg">{ev.title}</div>
                  {ev.description && (
                    <div className="text-sm text-slate-300">
                      {ev.description}
                    </div>
                  )}
                  <div className="text-sm text-slate-400">
                    📍 {ev.location || 'No location'} <br />
                    🗓 {ev.date || 'No date'} ⏰ {ev.time || 'No time'}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => toggleComplete(ev.id, !!ev.completed)}
                    className={`px-2 py-1 rounded text-sm ${
                      ev.completed
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {ev.completed ? 'Uncheck' : 'Check'}
                  </button>
                  <button
                    onClick={() => {
                      setEditId(ev.id)
                      setTitle(ev.title)
                      setDescription(ev.description || '')
                      setDate(ev.date || '')
                      setTime(ev.time || '')
                      setLocation(ev.location || '')
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEvent(ev.id)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
