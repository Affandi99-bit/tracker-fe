import React from 'react'

const Dashboard = ({ preview }) => {
    const monthlyCount = Array(12).fill(0);

    preview.forEach(project => {
        const month = new Date(project.createdAt).getMonth();
        monthlyCount[month]++;
    });

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const max = Math.max(...monthlyCount) || 1;
    return (
        <section className="w-full md:h-screen pointer-events-none z-0 fixed top-0 left-0 flex flex-col lg:flex-row justify-between items-center bg-dark px-12">
            <main className="flex flex-row justify-center md:justify-start gap-5 items-center flex-wrap w-full md:w-1/3 pt-16">
                <div className="w-20 h-28 md:w-40 md:h-32 flex flex-col justify-around items-center rounded-md font-body glass text-light p-1">
                    <p className="text-4xl md:text-7xl text-center font-bold font-body">{preview.length}</p>
                    <p className="text-center text-xs font-body">
                        Total project
                    </p>
                </div>
                <div className="w-20 h-28 md:w-40 md:h-32 flex flex-col justify-around items-center rounded-md font-body glass text-light p-1">
                    <p className="text-4xl md:text-7xl text-center font-bold font-body">
                        {preview.filter(p => p.status == "Done").length}
                    </p>
                    <p className="text-center text-xs font-body">
                        Total project done
                    </p>
                </div>
                <div className="w-20 h-28 md:w-40 md:h-32 flex flex-col justify-around items-center rounded-md font-body glass text-light p-1">
                    <p className="text-4xl md:text-7xl text-center font-bold font-body">
                        {preview.filter(p => p.status == "Ongoing").length}
                    </p>
                    <p className="text-center text-xs font-body">
                        Total project running
                    </p>
                </div>
                <div className="w-20 h-28 md:w-40 md:h-32 flex flex-col justify-around items-center rounded-md font-body glass text-light p-1">
                    <p className="text-4xl md:text-7xl text-center font-bold font-body">
                        {preview.filter(p => p.status == "Cancel").length}
                    </p>
                    <p className="text-center text-xs font-body">
                        Total project canceled
                    </p>
                </div>
            </main>
            <main className="w-full lg:w-2/3 h-96 mt-2">
                <h2 className="font-semibold text-light font-body">Projects Added Per Month</h2>
                <div className="flex items-end justify-between h-full pb-2">
                    {monthlyCount.map((count, index) => (
                        <div key={index} className="relative h-full flex flex-col items-center mx-1 flex-1">
                            {/* Bar */}
                            <div
                                className="w-full text-light font-body bg-zinc-700 rounded"
                                style={{ height: `${(count / max) * 100}%` }}
                            />
                            <p className="text-sm mt-2 text-light font-body">{monthLabels[index]}  <span className="px-3 rounded-2xl py-1 text-xs text-light bg-gray-400/25">
                                {count}
                            </span></p>

                        </div>
                    ))}
                </div>
            </main>
        </section>
    )
}

export default Dashboard