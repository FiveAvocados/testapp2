export default function (data) {
  console.log(data);
  let topics = [
    "Personal Background",
    "'Education questions'",
    "None",
    "none",
    "Education questions",
    "Family background questions",
  ];
  const quote = [];
  const result = [];
  const topic = [];
  // make an object in a format {id:, index:, original_id: quote: topic:, topic num}

  for (const [key, val] of Object.entries(data.idx)) {
    let dict = {};
    dict["original_id"] = val;
    result.push(dict);
  }

  for (const [key, val] of Object.entries(data.sentence)) {
    quote.push(val);
  }

  for (const [key, val] of Object.entries(data.topic)) {
    topic.push(val);
  }

  for (const item of result) {
    item.quote = quote[result.indexOf(item)];
    item.topic = topic[result.indexOf(item)];
    topics.forEach((element) => {
      if (element == topic[result.indexOf(item)]) {
        item.topic_num = topics.indexOf(element);
      }
    });
  }
  //console.log("Result after mapping");
  //console.log(result);
  return result;
  // append object into map
}
