import { useMemo, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router"

const Dashboard = () => {
  const tasks = useSelector((state) => state.items)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360)
    return `hsl(${hue}, 70%, 85%)`
  }

  const taskColors = useMemo(() => {
    return tasks.reduce(
      (colors, task) => ({
        ...colors,
        [task.id]: getRandomPastelColor(),
      }),
      {},
    )
  }, [tasks, getRandomPastelColor]) // Added getRandomPastelColor to dependencies

  const allDates = tasks.flatMap((task) => [new Date(task.startDate), new Date(task.endDate)])
  const earliestDate = new Date(Math.min(...allDates))
  const latestDate = new Date(Math.max(...allDates))

  const getDatesInRange = (start, end) => {
    const dates = []
    const current = new Date(start)
    while (current <= end) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return dates
  }

  const dates = getDatesInRange(earliestDate, latestDate)

  const getTaskStyle = (task) => {
    const startDate = new Date(task.startDate)
    const endDate = new Date(task.endDate)
    const timelineStart = earliestDate.getTime()
    const dayWidth = windowWidth < 640 ? 50 : 100 // Adjust day width for smaller screens

    const left = ((startDate.getTime() - timelineStart) / (24 * 60 * 60 * 1000)) * dayWidth
    const width = ((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) * dayWidth + dayWidth

    return {
      left: `${left}px`,
      width: `${width}px`,
      backgroundColor: taskColors[task.id],
      "--hover-color": taskColors[task.id].replace("85%", "75%"),
    }
  }

  return (
    <div className="min-h-screen bg-[url(https://cdn.svgator.com/images/2022/06/use-svg-as-background-image-particle-strokes.svg)]">
      <div className="p-4 sm:p-8">
        <div className="bg-white/15 rounded-2xl shadow-md p-4 sm:p-6 overflow-x-auto text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <div className="font-bold text-xl sm:text-2xl mb-2 sm:mb-0 text-yellow-300">Task Timeline</div>
            <Link
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              to={"/"}
            >
              Task Page
            </Link>
          </div>
          <div className="overflow-x-auto">
            <div className="flex border-b border-gray-700 mb-4 min-w-max mt-4">
              <div className="w-32 sm:w-48 flex-shrink-0 font-semibold">Task</div>
              <div className="flex font-semibold">
                {dates.map((date, i) => (
                  <div
                    key={i}
                    className="w-[50px] sm:w-[100px] px-1 sm:px-2 text-xs sm:text-sm text-gray-300 text-center"
                  >
                    {windowWidth < 640
                      ? date.toLocaleDateString("en-US", { day: "numeric" })
                      : date.toLocaleDateString("en-US", {
                          weekday: "short",
                          day: "numeric",
                        })}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6 min-w-max pb-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex group">
                  <div className="w-32 sm:w-48 flex-shrink-0 flex items-center">
                    <span className="text-xs sm:text-sm font-medium text-gray-200 truncate">{task.title}</span>
                  </div>
                  <div className="flex-1 relative min-h-[30px] sm:min-h-[40px]">
                    <div
                      className="absolute top-1 rounded-md p-1 sm:p-2 transition-colors shadow-sm group-hover:shadow-md hover:!bg-[var(--hover-color)]"
                      style={getTaskStyle(task)}
                    >
                      <div className="text-xs sm:text-sm truncate text-gray-800">
                        {`${new Date(task.startDate).toLocaleDateString()} - ${new Date(
                          task.endDate,
                        ).toLocaleDateString()}`}
                      </div>
                      {task.subTasks.length > 0 && windowWidth >= 640 && (
                        <div className="text-xs text-gray-600">
                          {`${
                            task.subTasks.filter((st) => st.status === "completed").length
                          }/${task.subTasks.length} subtasks`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

