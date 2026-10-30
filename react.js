const { useState, useEffect } = React;
// Form component (Add / Update)
function NoteForm({ addNote, updateNote, editingNote, cancelEdit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  useEffect(() => {
    setTitle(editingNote ? editingNote.title : "");
    setContent(editingNote ? editingNote.content : "");
  }, [editingNote]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { alert("Enter both title and content"); return; }
    if (editingNote) updateNote(editingNote.id, title, content);
    else addNote(title, content);
    setTitle(""); setContent("");
  };
  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Enter the title" value={title}
        onChange={(e) => setTitle(e.target.value)} />
      <textarea rows="4" placeholder="Enter the content" value={content}
        onChange={(e) => setContent(e.target.value)} />
      <div className="form-buttons">
        <button type="submit" className="btn primary">{editingNote ? "Update Note" : "Add Note"}</button>
        {editingNote && <button type="button" className="btn" onClick={cancelEdit}>Cancel</button>}
      </div>
    </form>
  );
}
// List component (View / Edit / Delete)
function NoteList({ notes, onEdit, onDelete }) {
  if (notes.length === 0) return <p className="empty">No notes found. Add your first note!</p>;
  return (
    <div className="note-list">
      {notes.map((note) => (
        <div className="note-card" key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <small>{note.date}</small>
          <div className="card-buttons">
            <button className="btn edit" onClick={() => onEdit(note)}>Edit</button>
            <button className="btn delete" onClick={() => onDelete(note.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
// Main App
function App() {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || []);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");
  useEffect(() => { localStorage.setItem("notes", JSON.stringify(notes)); }, [notes]);
  const addNote = (title, content) =>
    setNotes([{ id: Date.now(), title, content, date: new Date().toLocaleString() }, ...notes]);
  const updateNote = (id, title, content) => {
    setNotes(notes.map((n) => n.id === id ? { ...n, title, content, date: new Date().toLocaleString() } : n));
    setEditingNote(null);
  };
  const deleteNote = (id) => {
    if (window.confirm("Delete this note?")) {
      setNotes(notes.filter((n) => n.id !== id));
      setEditingNote(null);
    }
  };
  const filtered = notes.filter((n) =>
    (n.title + n.content).toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="app">
      <h1>Notes App</h1>
      <NoteForm addNote={addNote} updateNote={updateNote}
        editingNote={editingNote} cancelEdit={() => setEditingNote(null)} />
      <h2>My Notes</h2>
      <input className="search" type="text" placeholder="Search notes..." value={search}
        onChange={(e) => setSearch(e.target.value)} />
      <NoteList notes={filtered} onEdit={setEditingNote} onDelete={deleteNote} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
