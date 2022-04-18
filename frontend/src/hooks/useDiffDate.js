const useDiffDate = () => {
  return (date) => {
    let dateString = "";
    const compDate = new Date(date);
    const sysDate = new Date();
    // comp second :
    if (
      compDate.getDate() === sysDate.getDate() &&
      compDate.getMonth() === sysDate.getMonth() &&
      compDate.getFullYear() === sysDate.getFullYear() &&
      compDate.getHours() === sysDate.getHours() &&
      compDate.getMinutes() === sysDate.getMinutes() &&
      compDate.getSeconds() !== sysDate.getSeconds()
    ) {
      dateString = `${
        sysDate.getSeconds() - compDate.getSeconds()
      } secondes ago`;
    } else if (
      compDate.getDate() === sysDate.getDate() &&
      compDate.getMonth() === sysDate.getMonth() &&
      compDate.getFullYear() === sysDate.getFullYear() &&
      compDate.getHours() === sysDate.getHours() &&
      compDate.getMinutes() !== sysDate.getMinutes()
    ) {
      dateString = `${
        sysDate.getMinutes() - compDate.getMinutes()
      } minutes ago`;
    } else if (
      compDate.getDate() === sysDate.getDate() &&
      compDate.getMonth() === sysDate.getMonth() &&
      compDate.getFullYear() === sysDate.getFullYear() &&
      compDate.getHours() !== sysDate.getHours()
    ) {
      dateString = `${sysDate.getHours() - compDate.getHours()} hours ago`;
    } else if (
      compDate.getFullYear() === sysDate.getFullYear() &&
      compDate.getMonth() === sysDate.getMonth() &&
      compDate.getDate() !== sysDate.getDate()
    ) {
      dateString = `${sysDate.getDate() - compDate.getDate()} days ago`;
    } else if (
      compDate.getFullYear() === sysDate.getFullYear() &&
      compDate.getMonth() !== sysDate.getMonth()
    ) {
      dateString = `${sysDate.getMonth() - compDate.getMonth()} mounts ago`;
    } else if (compDate.getFullYear() !== sysDate.getFullYear()) {
      dateString = `${
        sysDate.getFullYear() - compDate.getFullYear()
      } years ago`;
    } else {
      dateString = `0 secondes ago`;
    }
    return dateString;
  };
};

export default useDiffDate;
