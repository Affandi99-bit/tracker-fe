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
        <section className="w-full min-h-screen pointer-events-none z-0 fixed top-0 left-0 flex flex-col lg:flex-row items-center bg-dark">
            <main className="mx-3">
                <section className="flex item-center gap-1 mb-1">
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
                </section>

                <section className="flex item-center gap-1 mb-1">
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
                </section>
            </main>
            <main className="w-full lg:w-2/3 h-96 mt-2">
                <h2 className="font-semibold text-light font-body">Projects Added Per Month</h2>
                <div className="flex items-start justify-between h-full pb-2">
                    {monthlyCount.map((count, index) => (
                        <div key={index} className="relative h-full flex flex-col-reverse items-center mx-1 flex-1">
                            {/* Bar */}
                            <p className="text-sm m-2 flex items-center text-light font-body">{monthLabels[index]}  <span className="h-5 w-7 mx-1 rounded-2xl flex items-center justify-center text-xs text-light bg-gray-400/25">
                                {count}
                            </span></p>
                            <div
                                className="w-full text-light font-body bg-zinc-700 rounded"
                                style={{ height: `${(count / max) * 100}%` }}
                            />
                        </div>
                    ))}
                </div>
            </main>
        </section>
    )
}

export default Dashboard