import React, { useState } from "react";

const Motion = () => {
  const [artists, setArtists] = useState([{ name: "", role: "" }]);
  const [assets, setAssets] = useState([{ type: "", link: "" }]);
  const [projectDetails, setProjectDetails] = useState({
    project_name: "",
    animation_style: "",
    delivery_date: "",
  });

  // Handlers for dynamic fields
  const addArtist = () => setArtists([...artists, { name: "", role: "" }]);
  const removeArtist = (index) =>
    setArtists(artists.filter((_, i) => i !== index));

  const addAsset = () => setAssets([...assets, { type: "", link: "" }]);
  const removeAsset = (index) =>
    setAssets(assets.filter((_, i) => i !== index));

  const handleProjectChange = (e) => {
    setProjectDetails({ ...projectDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 gap-5 mt-10 p-5">
      <section className="bg-gray-100 p-5 rounded-lg">
        <h1 className="font-bold text-lg mb-4">
          Motion Graphic Project Details
        </h1>

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

        {/* Animation Style */}
        <div className="mb-3">
          <label className="block font-medium">Animation Style</label>
          <input
            type="text"
            name="animation_style"
            value={projectDetails.animation_style}
            onChange={handleProjectChange}
            className="border rounded p-2 w-full"
            placeholder="Enter animation style (e.g., 2D, 3D)"
          />
        </div>

        {/* Delivery Date */}
        <div className="mb-3">
          <label className="block font-medium">Delivery Date</label>
          <input
            type="date"
            name="delivery_date"
            value={projectDetails.delivery_date}
            onChange={handleProjectChange}
            className="border rounded p-2 w-full"
          />
        </div>
      </section>
      <main className="flex items-center justify-center w-full gap-5">
        {/* Artists */}

        <section className="bg-gray-100 p-5 rounded-lg">
          <h1 className="font-bold text-lg mb-4">Motion Graphic Artists</h1>
          {artists.map((artist, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Name"
                value={artist.name}
                onChange={(e) =>
                  setArtists(
                    artists.map((a, i) =>
                      i === index ? { ...a, name: e.target.value } : a
                    )
                  )
                }
                className="border rounded p-2 w-1/2"
              />
              <input
                type="text"
                placeholder="Role"
                value={artist.role}
                onChange={(e) =>
                  setArtists(
                    artists.map((a, i) =>
                      i === index ? { ...a, role: e.target.value } : a
                    )
                  )
                }
                className="border rounded p-2 w-1/2"
              />
              <button
                onClick={() => removeArtist(index)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addArtist}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Artist
          </button>
        </section>

        {/* Assets */}
        <section className="bg-gray-100 p-5 rounded-lg">
          <h1 className="font-bold text-lg mb-4">Assets</h1>
          {assets.map((asset, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Type (e.g., Video, Image)"
                value={asset.type}
                onChange={(e) =>
                  setAssets(
                    assets.map((a, i) =>
                      i === index ? { ...a, type: e.target.value } : a
                    )
                  )
                }
                className="border rounded p-2 w-1/2"
              />
              <input
                type="text"
                placeholder="Link"
                value={asset.link}
                onChange={(e) =>
                  setAssets(
                    assets.map((a, i) =>
                      i === index ? { ...a, link: e.target.value } : a
                    )
                  )
                }
                className="border rounded p-2 w-1/2"
              />
              <button
                onClick={() => removeAsset(index)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addAsset}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Asset
          </button>
        </section>
      </main>
    </div>
  );
};

export default Motion;
