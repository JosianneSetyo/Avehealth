function calculateMedian(values) {
    const middleIndex = Math.floor(values.length / 2);
    console.log(middleIndex)
    if (values.length % 2 === 0) {
      // If there are an even number of values, take the average of the middle two values
      return (values[middleIndex - 1] + values[middleIndex]) / 2;
    } else {
      // If there are an odd number of values, take the middle value
      return values[middleIndex];
    }
  }
  
  function returnFiltered(stuff, deviationFactor) {
    const values = stuff;
    //Calculate median
    median = 0;
    const middleIndex = Math.floor(values.length / 2);
    console.log(middleIndex)
  
    //Calculate quartiles
    const q1 = calculateMedian(values.slice(0, middleIndex));
    const q3 = calculateMedian(values.slice(middleIndex + (values.length % 2 === 0 ? 0 : 1)));
    //apply filter
    values.sort((a, b) => a - b);
    const iqr = q3 - q1;
    console.log(iqr)
  
    const lowerBound = q1 - deviationFactor * iqr;
    const upperBound = q3 + deviationFactor * iqr;
    console.log(lowerBound)
    console.log(upperBound)

  }

  returnFiltered([150, 152, 151, 67, 150, 152, 150, 150, 150, 150, 150], 1.5)