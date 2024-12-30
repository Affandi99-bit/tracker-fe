import React, { useState } from "react";

const Dokumentasi = () => {
  const [crew, setCrew] = useState([{ name: "", role: "" }]);
  const [equipment, setEquipment] = useState([{ name: "", type: "" }]);
  const [deliverables, setDeliverables] = useState([
    { type: "", description: "" },
  ]);
  const [feedback, setFeedback] = useState([{ reviewer: "", comments: "" }]);
  const [eventDetails, setEventDetails] = useState({
    event_name: "",
    event_date: "",
    location: "",
  });

  // Handlers for dynamic fields
  const addCrew = () => setCrew([...crew, { name: "", role: "" }]);
  const removeCrew = (index) => setCrew(crew.filter((_, i) => i !== index));

  const addEquipment = () =>
    setEquipment([...equipment, { name: "", type: "" }]);
  const removeEquipment = (index) =>
    setEquipment(equipment.filter((_, i) => i !== index));

  const addDeliverable = () =>
    setDeliverables([...deliverables, { type: "", description: "" }]);
  const removeDeliverable = (index) =>
    setDeliverables(deliverables.filter((_, i) => i !== index));

  const addFeedback = () =>
    setFeedback([...feedback, { reviewer: "", comments: "" }]);
  const removeFeedback = (index) =>
    setFeedback(feedback.filter((_, i) => i !== index));

  const handleEventChange = (e) => {
    setEventDetails({ ...eventDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 gap-5 mt-10 p-5">
      {/* Event Details */}
      <section className="bg-gray-100 p-5 rounded-lg">
        <h1 className="font-bold text-lg mb-4">Event Details</h1>

        {/* Event Name */}
        <div className="mb-3">
          <label className="block font-medium">Event Name</label>
          <input
            type="text"
            name="event_name"
            value={eventDetails.event_name}
            onChange={handleEventChange}
            className="border rounded p-2 w-full"
            placeholder="Enter event name"
          />
        </div>

        {/* Event Date */}
        <div className="mb-3">
          <label className="block font-medium">Event Date</label>
          <input
            type="date"
            name="event_date"
            value={eventDetails.event_date}
            onChange={handleEventChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <label className="block font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={eventDetails.location}
            onChange={handleEventChange}
            className="border rounded p-2 w-full"
            placeholder="Enter event location"
          />
        </div>
      </section>

      {/* Documentation Crew */}
      <section className="bg-gray-100 p-5 rounded-lg">
        <h1 className="font-bold text-lg mb-4">Documentation Crew</h1>
        {crew.map((member, index) => (
          <div key={index} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Name"
              value={member.name}
              onChange={(e) =>
                setCrew(
                  crew.map((c, i) =>
                    i === index ? { ...c, name: e.target.value } : c
                  )
                )
              }
              className="border rounded p-2 w-1/2"
            />
            <input
              type="text"
              placeholder="Role"
              value={member.role}
              onChange={(e) =>
                setCrew(
                  crew.map((c, i) =>
                    i === index ? { ...c, role: e.target.value } : c
                  )
                )
              }
              className="border rounded p-2 w-1/2"
            />
            <button
              onClick={() => removeCrew(index)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addCrew}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Crew Member
        </button>
      </section>

      {/* Equipment */}
      <section className="bg-gray-100 p-5 rounded-lg">
        <h1 className="font-bold text-lg mb-4">Equipment</h1>
        {equipment.map((item, index) => (
          <div key={index} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Equipment Name"
              value={item.name}
              onChange={(e) =>
                setEquipment(
                  equipment.map((eq, i) =>
                    i === index ? { ...eq, name: e.target.value } : eq
                  )
                )
              }
              className="border rounded p-2 w-1/2"
            />
            <input
              type="text"
              placeholder="Type (e.g., Camera, Drone)"
              value={item.type}
              onChange={(e) =>
                setEquipment(
                  equipment.map((eq, i) =>
                    i === index ? { ...eq, type: e.target.value } : eq
                  )
                )
              }
              className="border rounded p-2 w-1/2"
            />
            <button
              onClick={() => removeEquipment(index)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addEquipment}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Equipment
        </button>
      </section>

      {/* Deliverables */}
      <section className="bg-gray-100 p-5 rounded-lg">
        <h1 className="font-bold text-lg mb-4">Deliverables</h1>
        {deliverables.map((deliverable, index) => (
          <div key={index} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Type (e.g., Video, Photos)"
              value={deliverable.type}
              onChange={(e) =>
                setDeliverables(
                  deliverables.map((d, i) =>
                    i === index ? { ...d, type: e.target.value } : d
                  )
                )
              }
              className="border rounded p-2 w-1/2"
            />
            <input
              type="text"
              placeholder="Description"
              value={deliverable.description}
              onChange={(e) =>
                setDeliverables(
                  deliverables.map((d, i) =>
                    i === index ? { ...d, description: e.target.value } : d
                  )
                )
              }
              className="border rounded p-2 w-1/2"
            />
            <button
              onClick={() => removeDeliverable(index)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addDeliverable}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Deliverable
        </button>
      </section>

      {/* Feedback */}
      <section className="bg-gray-100 p-5 rounded-lg">
        <h1 className="font-bold text-lg mb-4">Feedback</h1>
        {feedback.map((item, index) => (
          <div key={index} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Reviewer"
              value={item.reviewer}
              onChange={(e) =>
                setFeedback(
                  feedback.map((f, i) =>
                    i === index ? { ...f, reviewer: e.target.value } : f
                  )
                )
              }
              className="border rounded p-2 w-1/2"
            />
            <input
              type="text"
              placeholder="Comments"
              value={item.comments}
              onChange={(e) =>
                setFeedback(
                  feedback.map((f, i) =>
                    i === index ? { ...f, comments: e.target.value } : f
                  )
                )
              }
              className="border rounded p-2 w-1/2"
            />
            <button
              onClick={() => removeFeedback(index)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addFeedback}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Feedback
        </button>
      </section>
    </div>
  );
};

export default Dokumentasi;
