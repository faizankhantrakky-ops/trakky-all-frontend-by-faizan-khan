import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  FaPlus, FaTrash, FaEdit, FaSave, FaPalette, FaMinus, 
  FaExpand, FaCalendarAlt, FaUser, FaClock, FaIndianRupee,
  FaSearch, FaFilter, FaStickyNote, FaChevronDown, FaTag,
  FaPhone, FaShoppingCart, FaUsers, FaClipboardList, FaCog,
  FaEllipsisV, FaTimes, FaStickyNote as FaNote
} from 'react-icons/fa';
import AuthContext from '../../Context/Auth';
import toast from 'react-hot-toast';

const StickyNotes = () => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [showNoteMenu, setShowNoteMenu] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });


    let branchId = localStorage.getItem("branchId") || "";

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
       if (!navigator.onLine) {
          toast.error("No Internet Connection");
          return;
        }

    const fetchNotes = async () => {
      try {
        const res = await fetch('https://backendapi.trakky.in/salonvendor/stickynotes/', {
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch notes');
        const data = await res.json();

        const screenWidth = windowSize.width;
        const screenHeight = windowSize.height;

        const colWidth = screenWidth < 640 ? 250 : screenWidth < 768 ? 300 : 420;
        const cols = Math.max(1, Math.floor(screenWidth / colWidth));
        const rowHeight = screenWidth < 640 ? 220 : 380;

        const positionedNotes = data.map((note, index) => {
          const color = note.color.toLowerCase();
          let baseSize = { width: 340, height: 280 };
          if (note.size === 'Small') baseSize = { width: 250, height: 200 };
          if (note.size === 'Large') baseSize = { width: 400, height: 350 };

          const tags = note.tags ? note.tags.split(',').map(tag => tag.trim()) : [];
          const priorityMap = { 1: 'high', 2: 'medium', 3: 'low' };

          const row = Math.floor(index / cols);
          const col = index % cols;
          const x = col * (screenWidth / cols) + (screenWidth / cols - baseSize.width) / 2;
          const y = row * (baseSize.height + 40) + 60;

          return {
            id: note.id,
            title: note.title,
            content: note.content,
            color,
            size: baseSize,
            category: note.category.toLowerCase(),
            priority: priorityMap[note.priority] || 'medium',
            client: note.client,
            service: note.service,
            price: parseFloat(note.price),
            duration: note.duration,
            status: note.status,
            tags,
            position: { x, y },
            isEditing: false,
            isMinimized: false,
            createdAt: new Date(note.created_at)
          };
        });

        setNotes(positionedNotes);
      } catch (e) {
        console.error(e);
      }
    };

    fetchNotes();
  }, [authTokens, windowSize]);

  const [isDragging, setIsDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Professional solid colors
  const noteColors = [
    { name: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-blue-100', text: 'text-blue-800' },
    { name: 'green', bg: 'bg-green-50', border: 'border-green-200', header: 'bg-green-100', text: 'text-green-800' },
    { name: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', header: 'bg-purple-100', text: 'text-purple-800' },
    { name: 'orange', bg: 'bg-orange-50', border: 'border-orange-200', header: 'bg-orange-100', text: 'text-orange-800' },
    { name: 'pink', bg: 'bg-pink-50', border: 'border-pink-200', header: 'bg-pink-100', text: 'text-pink-800' },
    { name: 'gray', bg: 'bg-gray-50', border: 'border-gray-200', header: 'bg-gray-100', text: 'text-gray-800' }
  ];

  const categories = [
    { value: 'all', label: 'All Notes', icon: FaStickyNote, count: 0, color: 'gray' },
    { value: 'appointment', label: 'Appointments', icon: FaUser, count: 0, color: 'blue' },
    { value: 'inventory', label: 'Inventory', icon: FaShoppingCart, count: 0, color: 'green' },
    { value: 'meeting', label: 'Meetings', icon: FaUsers, count: 0, color: 'purple' },
    { value: 'supplies', label: 'Supplies', icon: FaClipboardList, count: 0, color: 'orange' },
    { value: 'staff', label: 'Staff', icon: FaUsers, count: 0, color: 'pink' },
    { value: 'clients', label: 'Clients', icon: FaUser, count: 0, color: 'gray' }
  ];

  const textareaRefs = useRef({});

  const autoResizeTextarea = (id) => {
    const textarea = textareaRefs.current[id];
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  const addNewNote = async (template = 'general') => {
    const templates = {
      appointment: {
        title: "Client Consultation",
        content: "Interested in service. Preferred time:\n\n• Follow up:\n• Phone:\n• Estimated:\n• Duration:",
        category: 'appointment',
        color: 'blue'
      },
      inventory: {
        title: 'Inventory Restock',
        content: "Items running low:\n\n• Item:\n• Quantity:\n• Supplier:\n• Contact:\n• Urgency:",
        category: 'inventory',
        color: 'green'
      },
      task: {
        title: 'New Task',
        content: 'Task Details:\n• Description: \n• Assigned To: \n• Deadline: \n• Priority: \n• Status: ',
        category: 'task',
        color: 'purple'
      },
      general: {
        title: 'New Note',
        content: 'Start typing your note here...\n\n• \n• \n• ',
        category: 'task',
        color: 'gray'
      }
    };

    const selectedTemplate = templates[template];
    setShowNoteMenu(false);

    const payload = {
      title: selectedTemplate.title,
      content: selectedTemplate.content,
      color: selectedTemplate.color.charAt(0).toUpperCase() + selectedTemplate.color.slice(1),
      size: "Medium",
      category: selectedTemplate.category.charAt(0).toUpperCase() + selectedTemplate.category.slice(1),
      priority: 2,
      client: "",
      service: "",
      price: "0.00",
      duration: "00:00:00",
      status: "active",
      tags: "new",
      vendor_user: vendorData.id,
      // branchId:branchId
    };

    try {
      const res = await fetch('https://backendapi.trakky.in/salonvendor/stickynotes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens?.access_token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create note');
      const newNoteFromServer = await res.json();

      const color = newNoteFromServer.color.toLowerCase();
      let baseSize = { width: 340, height: 280 };
      if (newNoteFromServer.size === 'Small') baseSize = { width: 250, height: 200 };
      if (newNoteFromServer.size === 'Large') baseSize = { width: 400, height: 350 };
      const tags = newNoteFromServer.tags ? newNoteFromServer.tags.split(',').map(tag => tag.trim()) : [];
      const priorityMap = { 1: 'high', 2: 'medium', 3: 'low' };

      const localNote = {
        id: newNoteFromServer.id,
        title: newNoteFromServer.title,
        content: newNoteFromServer.content,
        color,
        size: baseSize,
        category: newNoteFromServer.category.toLowerCase(),
        priority: priorityMap[newNoteFromServer.priority] || 'medium',
        client: newNoteFromServer.client,
        service: newNoteFromServer.service,
        price: parseFloat(newNoteFromServer.price),
        duration: newNoteFromServer.duration,
        status: newNoteFromServer.status,
        tags,
        position: { 
          x: Math.random() * (windowSize.width - baseSize.width - 40), 
          y: Math.random() * (windowSize.height - baseSize.height - 100) 
        },
        isEditing: true,
        isMinimized: false,
        createdAt: new Date(newNoteFromServer.created_at)
      };

      setNotes(prev => [...prev, localNote]);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNote = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`https://backendapi.trakky.in/salonvendor/stickynotes/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authTokens?.access_token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete note');
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const updateNoteContent = (id, content) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

  const updateNoteTitle = (id, title) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, title } : note
    ));
  };

  const toggleEditMode = async (id) => {
    const note = notes.find(n => n.id === id);
    if (note.isEditing) {
      const priorityMapReverse = { high: 1, medium: 2, low: 3 };
      const payload = {
        title: note.title,
        content: note.content,
        color: note.color.charAt(0).toUpperCase() + note.color.slice(1),
        size: note.size.width < 300 ? 'Small' : note.size.width > 350 ? 'Large' : 'Medium',
        category: note.category.charAt(0).toUpperCase() + note.category.slice(1),
        priority: priorityMapReverse[note.priority] || 2,
        client: note.client || '',
        service: note.service || '',
        price: note.price ? note.price.toFixed(2) : '0.00',
        duration: note.duration || '00:00:00',
        status: note.status || 'active',
        tags: note.tags.join(','),
        vendor_user: vendorData.id
      };

      try {
        const res = await fetch(`https://backendapi.trakky.in/salonvendor/stickynotes/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens?.access_token}`
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to update note');
      } catch (e) {
        console.error(e);
      }
    }

    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, isEditing: !note.isEditing } : note
    ));
  };

  const changeNoteColor = async (id, color) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, color } : note
    ));

    try {
      const res = await fetch(`https://backendapi.trakky.in/salonvendor/stickynotes/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens?.access_token}`
        },
        body: JSON.stringify({ color: color.charAt(0).toUpperCase() + color.slice(1) })
      });
      if (!res.ok) throw new Error('Failed to update color');
    } catch (e) {
      console.error(e);
    }

    setShowColorPicker(null);
  };

  const toggleMinimize = (id, e) => {
    e?.stopPropagation();
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, isMinimized: !note.isMinimized } : note
    ));
  };

  const handleMouseDown = (id, e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.closest('button')) return;
    
    const note = notes.find(note => note.id === id);
    setIsDragging(id);
    setDragOffset({
      x: e.clientX - note.position.x,
      y: e.clientY - note.position.y
    });
  };

  const handleTouchStart = (id, e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.closest('button')) return;
    
    const touch = e.touches[0];
    const note = notes.find(note => note.id === id);
    setIsDragging(id);
    setDragOffset({
      x: touch.clientX - note.position.x,
      y: touch.clientY - note.position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const note = notes.find(note => note.id === isDragging);
    if (!note) return;

    setNotes(prev => prev.map(n => 
      n.id === isDragging 
        ? { 
            ...n, 
            position: { 
              x: Math.max(0, Math.min(e.clientX - dragOffset.x, windowSize.width - n.size.width)),
              y: Math.max(0, Math.min(e.clientY - dragOffset.y, windowSize.height - n.size.height))
            } 
          } 
        : n
    ));
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const note = notes.find(note => note.id === isDragging);
    if (!note) return;

    setNotes(prev => prev.map(n => 
      n.id === isDragging 
        ? { 
            ...n, 
            position: { 
              x: Math.max(0, Math.min(touch.clientX - dragOffset.x, windowSize.width - n.size.width)),
              y: Math.max(0, Math.min(touch.clientY - dragOffset.y, windowSize.height - n.size.height))
            } 
          } 
        : n
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleTouchEnd = () => {
    setIsDragging(null);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Update category counts
  categories.forEach(cat => {
    cat.count = notes.filter(note => 
      cat.value === 'all' ? true : note.category === cat.value
    ).length;
  });

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset, windowSize]);

  const getNoteStyle = (note) => {
    const colorConfig = noteColors.find(c => c.name === note.color) || noteColors[0];
    const effectiveWidth = Math.min(note.size.width, windowSize.width - 40);
    const effectiveHeight = Math.min(note.size.height, windowSize.height - 100);
    return {
      transform: `translate(${note.position.x}px, ${note.position.y}px)`,
      width: effectiveWidth,
      height: note.isMinimized ? '60px' : effectiveHeight,
      zIndex: notes.findIndex(n => n.id === note.id) + 1
    };
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? React.createElement(cat.icon, { className: "inline mr-2 text-sm" }) : <FaStickyNote className="inline mr-2 text-sm" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full relative overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 w-full shadow-sm">
        <div className=" mx-auto px-28 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-600 p-3 rounded-lg shadow-sm">
                <FaNote className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Notes Manager</h1>
                <p className="text-gray-600 text-sm">Professional workspace organization</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{notes.length}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Total Notes</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {notes.filter(n => n.priority === 'high').length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {notes.filter(n => n.status === 'completed').length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className=" mx-auto px-28 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 flex-1 min-w-[300px]">
              {categories.map(category => {
                const IconComponent = category.icon;
                const isActive = selectedCategory === category.value;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-600 text-white border-indigo-900 shadow-sm' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <IconComponent className="text-sm" />
                    <span className="text-sm font-medium">{category.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isActive ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="flex items-center space-x-4">
              <div className="relative w-full sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all w-full text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Container */}
      <div className="w-full h-[calc(100vh-180px)] relative overflow-auto bg-gray-50 pl-0 md:pl-20">
        {filteredNotes.map((note) => {
          const colorConfig = noteColors.find(c => c.name === note.color) || noteColors[0];
          
          return (
            <div
              key={note.id}
              className={`absolute cursor-move transition-all duration-300 ${
                colorConfig.bg
              } ${colorConfig.border} border rounded-lg shadow-sm ${
                note.isMinimized ? 'minimized-note' : ''
              } hover:shadow-md backdrop-blur-sm`}
              style={getNoteStyle(note)}
              onMouseDown={(e) => handleMouseDown(note.id, e)}
              onTouchStart={(e) => handleTouchStart(note.id, e)}
            >
              {/* Note Header */}
              <div className={`flex justify-between items-center p-4 border-b ${colorConfig.border} ${colorConfig.header} rounded-t-lg`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={(e) => toggleMinimize(note.id, e)}
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center hover:bg-white/50 rounded transition-colors"
                  >
                    <FaMinus className="text-xs text-gray-600" />
                  </button>
                  
                  <button
                    onClick={() => setShowColorPicker(showColorPicker === note.id ? null : note.id)}
                    className="flex-shrink-0 w-7 h-7 rounded border border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center bg-white"
                  >
                    <FaPalette className="text-xs text-gray-600" />
                  </button>
                  
                  {showColorPicker === note.id && (
                    <div className="absolute top-12 left-2 bg-white p-3 rounded-lg shadow-lg border border-gray-300 z-50">
                      <div className="grid grid-cols-3 gap-2">
                        {noteColors.map((color) => (
                          <button
                            key={color.name}
                            className={`w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform ${color.bg}`}
                            onClick={() => changeNoteColor(note.id, color.name)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex-1 min-w-0 ml-1">
                    {note.isEditing ? (
                      <input
                        value={note.title || ''}
                        onChange={(e) => updateNoteTitle(note.id, e.target.value)}
                        className="w-full bg-transparent font-semibold text-gray-800 outline-none text-sm"
                        placeholder="Note title..."
                      />
                    ) : (
                      <div className="font-semibold text-gray-800 text-sm truncate flex items-center">
                        {getCategoryIcon(note.category)}
                        {note.title}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleEditMode(note.id)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-white/50 rounded transition-colors"
                  >
                    {note.isEditing ? <FaSave className="text-xs text-gray-600" /> : <FaEdit className="text-xs text-gray-600" />}
                  </button>
                  <button
                    onClick={(e) => deleteNote(note.id, e)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-red-100 rounded transition-colors"
                  >
                    <FaTrash className="text-xs text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Note Content */}
              {!note.isMinimized && (
                <div className="p-4 h-[calc(100%-72px)]">
                  {note.isEditing ? (
                    <textarea
                      ref={el => textareaRefs.current[note.id] = el}
                      value={note.content}
                      onChange={(e) => {
                        updateNoteContent(note.id, e.target.value);
                        autoResizeTextarea(note.id);
                      }}
                      className="w-full h-full bg-transparent resize-none outline-none text-gray-700 leading-relaxed text-sm font-normal font-sans"
                      placeholder="Start typing your note..."
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="w-full h-full overflow-y-auto text-gray-700 leading-relaxed whitespace-pre-wrap cursor-text text-sm font-normal font-sans"
                      onClick={() => toggleEditMode(note.id)}
                    >
                      {note.content}
                    </div>
                  )}
                  
                  {/* Note Metadata */}
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-xs" />
                      <span>{note.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        note.priority === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
                        note.priority === 'medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {note.priority}
                      </div>
                      {note.tags && note.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs border border-gray-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        {showNoteMenu && (
          <div className="absolute bottom-16 right-0 mb-4 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48">
            <button
              onClick={() => addNewNote('appointment')}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center space-x-3 text-sm"
            >
              <FaUser className="text-blue-600 text-sm" />
              <span>New Appointment</span>
            </button>
            <button
              onClick={() => addNewNote('inventory')}
              className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors flex items-center space-x-3 text-sm"
            >
              <FaShoppingCart className="text-green-600 text-sm" />
              <span>Inventory Note</span>
            </button>
            <button
              onClick={() => addNewNote('task')}
              className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors flex items-center space-x-3 text-sm"
            >
              <FaClipboardList className="text-purple-600 text-sm" />
              <span>New Task</span>
            </button>
            <button
              onClick={() => addNewNote('general')}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 text-sm border-t border-gray-100"
            >
              <FaNote className="text-gray-600 text-sm" />
              <span>General Note</span>
            </button>
          </div>
        )}
        
        <button
          onClick={() => setShowNoteMenu(!showNoteMenu)}
          className="bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center w-14 h-14"
        >
          {showNoteMenu ? <FaTimes className="text-lg" /> : <FaPlus className="text-lg" />}
        </button>
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200 max-w-md">
            <div className="text-5xl mb-6">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {searchTerm || selectedCategory !== 'all' ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-600 mb-8 text-sm leading-relaxed">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search terms or select a different category.' 
                : 'Start organizing your work by creating your first note.'}
            </p>
            <button
              onClick={() => addNewNote()}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg shadow-sm transition-all duration-200 flex items-center space-x-2 mx-auto text-sm font-medium"
            >
              <FaPlus />
              <span>Create New Note</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyNotes; 