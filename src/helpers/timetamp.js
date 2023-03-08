export function dateRangeString(fromDateJs, toDateJs) {
  if (!fromDateJs || !toDateJs) return null;

  if (fromDateJs.format("YYYY") !== toDateJs.format("YYYY")) {
    return (
      fromDateJs.format("DD MMM YYYY") + " - " + toDateJs.format("DD MMM YYYY")
    );
  } else if (fromDateJs.format("MM") !== toDateJs.format("MM")) {
    return fromDateJs.format("DD MMM") + " - " + toDateJs.format("DD MMM YYYY");
  } else if (fromDateJs.format("DD") !== toDateJs.format("DD")) {
    return fromDateJs.format("DD") + " - " + toDateJs.format("DD MMM YYYY");
  } else {
    return fromDateJs.format("DD MMM YYYY");
  }
}

export function timeString(fromDateJs, toDateJs) {
  if (!fromDateJs || !toDateJs) return null;

  return fromDateJs.format("hh:mm A") + " - " + toDateJs.format("hh:mm A");
}
