import React, { useState } from "react";

const Design = () => {
  const [teamMembers, setTeamMembers] = useState([{ name: "", role: "" }]);
  const [deliverables, setDeliverables] = useState([
    { type: "", description: "" },
  ]);
  const [feedback, setFeedback] = useState([{ reviewer: "", comments: "" }]);
  const [projectDetails, setProjectDetails] = useState({
    project_name: "",
    design_style: "",
    deadline: "",
  });

  // Handlers for dynamic fields
  const addTeamMember = () =>
    setTeamMembers([...teamMembers, { name: "", role: "" }]);
  const removeTeamMember = (index) =>
    setTeamMembers(teamMembers.filter((_, i) => i !== index));

  const addDeliverable = () =>
    setDeliverables([...deliverables, { type: "", description: "" }]);
  const removeDeliverable = (index) =>
    setDeliverables(deliverables.filter((_, i) => i !== index));

  const addFeedback = () =>
    setFeedback([...feedback, { reviewer: "", comments: "" }]);
  const removeFeedback = (index) =>
    setFeedback(feedback.filter((_, i) => i !== index));

  const handleProjectChange = (e) => {
    setProjectDetails({ ...projectDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 gap-5 mt-10 p-5">
      <section className="bg-gray-100 p-5 rounded-lg">
        <h1 className="font-bold text-lg mb-4">Design Project Details</h1>

        {/* Project Name */}
        <div className="mb-3">
          <label className="block font-medium">Project Name</label>
          <input
            type="text"
            name="project_name"
            value={projectDetails.project_name}
            onChange={handleProjectChange}
            className="border rounded p-2 w-full"
            placeholder="Enter project name"
          />
        </div>

        {/* Design Style */}
        <div className="mb-3">
          <label className="block font-medium">Design Style</label>
          <input
            type="text"
            name="design_style"
            value={projectDetails.design_style}
            onChange={handleProjectChange}
            className="border rounded p-2 w-full"
            placeholder="Enter design style (e.g., Minimalist, Abstract)"
          />
        </div>

        {/* Deadline */}
        <div className="mb-3">
          <label className="block font-medium">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={projectDetails.deadline}
            onChange={handleProjectChange}
            className="border rounded p-2 w-full"
          />
        </div>
      </section>

      {/* Team Members */}
      <section className="bg-gray-100 p-5 rounded-lg">
        <h1 className="font-bold text-lg mb-4">Design Team Members</h1>
        {teamMembers.map((member, index) => (
          <div key={index} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Name"
              value={member.name}
              onChange={(e) =>
                setTeamMembers(
                  teamMembers.map((m, i) =>
                    i === index ? { ...m, name: e.target.value } : m
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
                setTeamMembers(
                  teamMembers.map((m, i) =>
                    i === index ? { ...m, role: e.target.value } : m
                  )
                )
              }
              className="border rounded p-2 w-1/2"
            />
            <button
              onClick={() => removeTeamMember(index)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addTeamMember}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Team Member
        </button>
      </section>

      {/* Deliverables */}
      <section className="bg-gray-100 p-5 rounded-lg">
        <h1 className="font-bold text-lg mb-4">Required Deliverables</h1>
        {deliverables.map((deliverable, index) => (
          <div key={index} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Type (e.g., Logo, Brochure)"
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

export default Design;
