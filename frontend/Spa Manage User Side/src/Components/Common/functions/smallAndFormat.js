const smallAndFormat = (str) => {

    if (!str || str == undefined) {
        return '';
        }


    return str
      .split(/[\s-]+/)
      .join(' ');
  };
   
  export default smallAndFormat;