// Track any activity and update heatmap
export const trackActivity = (activityType) => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Get existing activity data
  const stored = localStorage.getItem("activityHeatmap");
  const activityData = stored ? JSON.parse(stored) : {};

  // Increment count for today
  activityData[dateStr] = (activityData[dateStr] || 0) + 1;

  // Save back to localStorage
  localStorage.setItem("activityHeatmap", JSON.stringify(activityData));

  console.log(`Activity tracked: ${activityType} on ${dateStr}`);
};
