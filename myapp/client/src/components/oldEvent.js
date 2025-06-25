import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import "./Event.css";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from "docx";
import { saveAs } from "file-saver";

// const BASE_URL = "https://iceu.onrender.com";
const BASE_URL = "http://localhost:5000";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventName: "",
    year: "",
    date: "",
    place: "",
    outcome: "",
    flier: null,
    participants_count: '',
    description: "",
    Accepted_Jesus: '',
    Non_Christian_Accept_Jesus: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/events`)
      .then((res) => {
        // Sort events by order if they are not sorted in the backend query
        setEvents(res.data.sort((a, b) => a.order - b.order));
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const handleDelete = async (index) => {
    const eventId = events[index]._id;
    try {
      await axios.delete(`${BASE_URL}/events/delete/${eventId}`);
      setEvents(events.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting event:", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileData = new FormData();

    const dataToSend = {
      ...formData,
      participants_count: parseInt(formData.participants_count) || 0,
      Accepted_Jesus: parseInt(formData.Accepted_Jesus) || 0,
      Non_Christian_Accept_Jesus: parseInt(formData.Non_Christian_Accept_Jesus) || 0,
    };
  
    Object.entries(dataToSend).forEach(([key, value]) => {
      if (key === "flier" && value ) {
        fileData.append("flier", value);
      } else {
        fileData.append(key, value);
      }
    });
    

    const url =
      editIndex !== null
        ? `${BASE_URL}/events/${events[editIndex]._id}`
        : `${BASE_URL}/events`;
    const method = editIndex !== null ? "put" : "post";

    try {
      const response = await axios({
        method,
        url,
        data: fileData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedEvent = response.data;
      setEvents((prev) =>
        editIndex !== null
          ? prev.map((item, i) => (i === editIndex ? updatedEvent : item))
          : [...prev, updatedEvent]
      );
      resetForm();
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  const resetForm = () => {
    setEditIndex(null);
    setFormData({
    eventName: "",
    year: "",
    date: "",
    place: "",
    outcome: "",
    flier: null,
    participants_count: '',
    description: "",
    Accepted_Jesus: '',
    Non_Christian_Accept_Jesus: '',
    });
    setShowForm(false);
  };

  const filteredEvents = yearFilter
    ? events.filter((e) => e.year === yearFilter)
    : events;

    const handleDragEnd = async (result) => {
      if (!result.destination) return;
    
      const reordered = Array.from(events);
      const [movedItem] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, movedItem);
    
      // Update frontend state immediately
      setEvents(reordered);
      // Send updated order to backend
      try {
        await axios.put(`${BASE_URL}/events/reorder`, {
          reorderedIds: reordered.map((event, index) => ({
            id: event._id,
            order: index
          }))
        });
      } catch (error) {
        console.error("Error saving reordered events:", error);
      }
    };


    const downloadAsDocx = () => {
      const rows = [];
    
      // Header Row
      rows.push(
        new TableRow({
          children: [
            "Year", "Name", "Date", "Place", "Participants", "Accepted Jesus", "Non-Christian Accept Jesus", "Outcome"
          ].map(text => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })] }))
        })
      );
    
      // Data Rows
      filteredEvents.forEach(event => {
        rows.push(
          new TableRow({
            children: [
              event.year,
              event.eventName,
              event.date,
              event.place,
              `${event.participants_count || 0}`,
              `${event.Accepted_Jesus || 0}`,
              `${event.Non_Christian_Accept_Jesus || 0}`,
              event.outcome || ""
            ].map(text => new TableCell({ children: [new Paragraph(text)] }))
          })
        );
      });
    
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "Event Report",
                heading: "Heading1",
                spacing: { after: 300 }
              }),
              new Table({
                rows: rows,
              }),
            ],
          },
        ],
      });
    
      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Event_Report.docx");
      });
    };


  return (
    <div className="event-container">
      <h2>Event Manager</h2>

     
      <div className="top-controls">
  <button onClick={() => setShowForm(true)}>Add Event</button>
  <input
    type="text"
    placeholder="Filter by Year"
    value={yearFilter}
    onChange={(e) => setYearFilter(e.target.value)}
  />
  <button onClick={downloadAsDocx}>Download as DOCX</button>

</div>


      {showForm && (
        <form onSubmit={handleSubmit} className="event-form">
          <input
            type="text"
            placeholder="Event Name"
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            required
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            
          />
          <input
            type="text"
            placeholder="Place"
            value={formData.place}
            onChange={(e) => setFormData({ ...formData, place: e.target.value })}
            
          />
          <input
            type="number"
            placeholder="Participant Count"
            value={formData.participants_count}
            onChange={(e) =>
              setFormData({ ...formData, participants_count: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Outcome"
            value={formData.outcome}
            onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) => setFormData({ ...formData, flier: e.target.files[0] })}
          />
          {editIndex !== null && (
            <div>
              <p style={{ fontStyle: 'italic', color: 'gray' }}>
                If you uploaded the flier before, then don’t fill this column — you can skip this.
              </p>
              <select
                onChange={(e) =>
                  setFormData({ ...formData, flier_condition: e.target.value })
                }
              >
                <option value="same">Same</option>
                <option value="default">Default</option>
              </select>
            </div>
          )}


          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Accepted Jesus"
            value={formData.Accepted_Jesus}
            onChange={(e) =>
              setFormData({ ...formData, Accepted_Jesus: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Non-Christian Accept Jesus"
            value={formData.Non_Christian_Accept_Jesus}
            onChange={(e) =>
              setFormData({ ...formData, Non_Christian_Accept_Jesus: e.target.value })
            }
          />
          
          <button type="submit">{editIndex !== null ? "Update" : "Create"} Event</button>
          <button type="button" onClick={resetForm}>Cancel</button>
        </form>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="eventTable">
          {(provided) => (
            <table className="event-table" {...provided.droppableProps} ref={provided.innerRef}>
              <thead>
                <tr>
                  <th>Flier</th>
                  <th>Year</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Place</th>
                  <th>Participants</th>
                  <th>Accepted Jesus</th>
                  <th>Non-Christian Accept Jesus</th>
                  <th>Outcome</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => (
                  <Draggable key={event._id} draggableId={event._id} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <td>
                          <img
                            src={
                              event.flier
                                ? event.flier
                                : null
                            }
                            alt="Flier"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td>{event.year}</td>
                        <td>{event.eventName}</td>
                        <td>{event.date}</td>
                        <td>{event.place}</td>
                        <td>{event.participants_count || 0}</td>
                        <td>{event.Accepted_Jesus || 0}</td>
                        <td>{event.Non_Christian_Accept_Jesus || 0}</td>
                        <td>{event.outcome}</td>
                        <td>
                          <FiEdit2
                            className="icon-btn edit-icon"
                            onClick={() => {
                              setFormData({
                                eventName: event.eventName,
                                year: event.year,
                                date: event.date,
                                place: event.place,
                                participants_count: event.participants_count,
                                outcome: event.outcome,
                                flier: null,
                                description: event.description,
                                Accepted_Jesus: event.Accepted_Jesus,
                                Non_Christian_Accept_Jesus:
                                  event.Non_Christian_Accept_Jesus,
                              });
                              setEditIndex(index);
                              setShowForm(true);
                            }}
                          />
                          <FiTrash2
                            className="icon-btn delete-icon"
                            onClick={() => handleDelete(index)}
                          />
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Event;


