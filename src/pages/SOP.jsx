import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const GOOGLE_API_KEY = "AIzaSyDc6sqyAKybW9hTzMylP3QHtSc78xUbRXI";

const DriveFolderPreview = ({ folderId, list, search, files, setFiles, loading, setLoading }) => {
    const fetchFilesRecursive = async (id) => {
        const query = `https://www.googleapis.com/drive/v3/files?q='${id}'+in+parents&fields=files(id,name,mimeType,webViewLink,createdTime)&key=${GOOGLE_API_KEY}`;
        const res = await fetch(query);
        const data = await res.json();

        let results = [];
        for (let file of data.files || []) {
            if (file.mimeType === "application/vnd.google-apps.folder") {
                const subFiles = await fetchFilesRecursive(file.id);
                results = results.concat(subFiles);
            } else {
                results.push(file);
            }
        }
        return results;
    };

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const allFiles = await fetchFilesRecursive(folderId);
                setFiles(allFiles);
            } catch (err) {
                console.error("Error fetching Drive files:", err);
            }
            setLoading(false);
        };
        fetchAll();
    }, [folderId, setFiles, setLoading]);

    const filteredFiles = search
        ? files.filter(file =>
            file.name.toLowerCase().includes(search.toLowerCase())
        )
        : files;

    if (!loading && filteredFiles.length === 0) return null;

    return (
        <div className="flex items-center justify-center gap-5 flex-wrap">
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        className="size-5 animate-spin"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M21.4155 15.3411C18.5924 17.3495 14.8895 17.5726 11.877 16M2.58445 8.65889C5.41439 6.64566 9.12844 6.42638 12.1448 8.01149M15.3737 14.1243C18.2604 12.305 19.9319 8.97413 19.601 5.51222M8.58184 9.90371C5.72231 11.7291 4.06959 15.0436 4.39878 18.4878M15.5269 10.137C15.3939 6.72851 13.345 3.61684 10.1821 2.17222M8.47562 13.9256C8.63112 17.3096 10.6743 20.392 13.8177 21.8278M19.071 4.92893C22.9763 8.83418 22.9763 15.1658 19.071 19.071C15.1658 22.9763 8.83416 22.9763 4.92893 19.071C1.02369 15.1658 1.02369 8.83416 4.92893 4.92893C8.83418 1.02369 15.1658 1.02369 19.071 4.92893ZM14.8284 9.17157C16.3905 10.7337 16.3905 13.2663 14.8284 14.8284C13.2663 16.3905 10.7337 16.3905 9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157Z"
                            stroke="#f8f8f8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            ) : (
                list ?
                    // List View
                    <React.Fragment>
                        {filteredFiles.map((file) => (
                            <a key={file.id} href={file.webViewLink} target='_blank' rel="noopener noreferrer" className='relative flex justify-between items-center w-full hover:border-b-light/50 hover:border-b transition ease-in-out duration-300 active:scale-95'>
                                <span className='text-sm text-start font-bold w-full'>{file.name}</span>
                                <span className='w-40 text-xs flex justify-center items-center gap-5'>Read More...
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="#f8f8f8"
                                        className="size-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                </span>
                            </a>
                        ))}
                    </React.Fragment>
                    :
                    // Grid View
                    <React.Fragment>
                        {filteredFiles.map((file) => (
                            <a key={file.id} href={file.webViewLink} target='_blank' rel="noopener noreferrer" className='relative select-none rounded-xl glass w-56 h-48 p-5 cursor-pointer hover:scale-105 hover:border-light/50 hover:border transition ease-in-out duration-300 active:scale-95'>
                                <span className='text-sm text-start font-bold w-full'>{file.name}</span>
                                <span className='absolute bottom-0 left-0 text-xs w-full flex justify-between items-center p-2 border-t border-t-light/50'>Read More...
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="#f8f8f8"
                                        className="size-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                </span>
                            </a>
                        ))}
                    </React.Fragment>
            )}
        </div>
    );
};

const SOP = () => {
    const [box, setBox] = useState(false);
    const [list, setList] = useState(false);
    const [search, setSearch] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInput = (e) => {
        setSearch(e.target.value);
    };

    // Stats
    const totalDocuments = files.length;
    const filteredFiles = search
        ? files.filter(file =>
            file.name.toLowerCase().includes(search.toLowerCase())
        )
        : files;
    const recentlyAdded = files
        .slice()
        .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
        .slice(0, 1)[0]?.name || "-";
    // You can customize mostActive, categories, departments, activeUsers, mostSearched as needed

    return (
        <main className='bg-dark font-body text-light overflow-auto h-screen'>
            <Link to={"/"} className='flex justify-between items-center p-4 w-full'>
                <button id='back' className='w-32 transition ease-in-out hover:scale-105 duration-300 active:scale-95 cursor-pointer flex justify-center items-center gap-2 text-xs'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Back
                </button>
            </Link>
            <section className="w-full">
                <p className='w-full text-center text-5xl'>SOP Lists</p>
                <main className="flex flex-col items-center justify-center gap-3 mt-10 px-5">
                    <section className='w-full flex items-center justify-center gap-3'>
                        <div className='h-40 w-1/3 glass rounded-xl p-2 flex flex-col items-center justify-center'>
                            <p className='text-5xl font-bold'>{totalDocuments}</p>
                            <p className='text-xs text-center'>Total Documents</p>
                        </div>
                        <div className='h-40 w-1/3 glass rounded-xl p-2 flex flex-col items-center justify-center'>
                            <p className='text-5xl font-bold'>{filteredFiles.length}</p>
                            <p className='text-xs text-center'>Most Active (Search Result)</p>
                        </div>
                        <div className='h-40 w-1/3 glass rounded-xl p-2 flex flex-col items-center justify-center'>
                            <p className='text-lg font-bold'>{recentlyAdded}</p>
                            <p className='text-xs text-center'>Recently added</p>
                        </div>
                    </section>
                    <section className='w-full flex items-center justify-center gap-3'>
                        <div className='h-40 w-1/4 glass rounded-xl p-2 flex flex-col items-center justify-center'>
                            <p className='text-5xl font-bold'>4</p>
                            <p className='text-xs text-center'>Categories</p>
                        </div>
                        <div className='h-40 w-1/4 glass rounded-xl p-2 flex flex-col items-center justify-center'>
                            <p className='text-5xl font-bold'>3</p>
                            <p className='text-xs text-center'>Departements</p>
                        </div>
                        <div className='h-40 w-1/4 glass rounded-xl p-2 flex flex-col items-center justify-center'>
                            <p className='text-5xl font-bold'>15</p>
                            <p className='text-xs text-center'>Active Users</p>
                        </div>
                        <div className='h-40 w-1/4 glass rounded-xl p-2 flex flex-col items-center justify-center'>
                            <p className='text-5xl font-bold'>{search ? search : "-"}</p>
                            <p className='text-xs text-center'>Most Searched</p>
                        </div>
                    </section>
                </main>
                <section className="py-10 px-4 w-1/2 ">
                    <p className='text-xl font-bold tracking-wider'>Knowledge Repository</p>
                    <p className='text-xs mt-5'>Di sini kamu akan menemukan seluruh dokumentasi penting yang menjadi fondasi kerja di Blackstudio. Mulai dari SOP, jobdesk tiap divisi, hingga workflow & sistem kerja yang dirancang untuk memastikan efisiensi, kolaborasi, dan kualitas terbaik di setiap project. Semua file tersinkron langsung dari sistem kami dan selalu update secara real-time. Gunakan fitur pencarian untuk menemukan dokumen yang kamu butuhkan secara cepat dan tepat.</p>
                </section>
                <main className="p-10 border-t border-light/50">
                    <nav className="relative flex items-center gap-2 w-full justify-end pb-10">
                        <input
                            type="text"
                            onChange={handleInput}
                            value={search}
                            className="border text-light border-light/25 glass rounded-xl px-2 py-1 w-40 outline-none scale-95"
                            placeholder="Search..."
                        />
                        <button onClick={() => { setBox(!box); setList(!list) }} className='transition ease-in-out hover:scale-110  duration-300 active:scale-90 cursor-pointer '>
                            {box ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                            </svg>}
                        </button>
                    </nav>
                    <section className='p-5'>
                        <DriveFolderPreview
                            folderId="1VsQh_5aFLt8Fjxx8BtNqPZERmx9587oB"
                            list={list}
                            search={search}
                            files={files}
                            setFiles={setFiles}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    </section>
                </main>
            </section>
        </main>
    )
}

export default SOP