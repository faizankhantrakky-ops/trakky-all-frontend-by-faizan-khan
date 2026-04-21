const capitalizeAndFormat = (str) => {


  if (!str || str == undefined) {
    return '';
  }

  return str
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};



export default capitalizeAndFormat;