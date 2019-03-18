module.exports = function () {

  var req = this.req;
  var res = this.res;

  const { WebhookClient } = require('dialogflow-fulfillment');
  // const {Card, Suggestion} = require('dialogflow-fulfillment');

  const agent = new WebhookClient({ request: req, response: res });

  function welcome(agent) {
    agent.add(`你好~我是病不孤單人工客服，免費幫您按預算找專科手術醫生，以及提供數據讓你更了解你的手術收費。請問你想查詢甚麼手術? (in sail )`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

// get the price via the general option id and specific option id
  function provideSurgery(agent){
    let conv = agent.conv();
    console.log("::::::::in user provide surgery:::::::::::::::");
    console.log(conv);
    let params = agent.parameters;
    surgery = params.surgery;
    console.log("The surgery is "+surgery);
    return agent.add('請輸入負責手術的醫生名字，如不知道請輸入"0"**(in sailed)');
  }

  function provideDoctor(agent){
    let conv = agent.conv();
    console.log(":::::::::::in user provide doctor name::::::::::::");
    console.log(conv);
    return agent.add('胃鏡基線案例收費通常為8300至13300，基線案例：A.沒息肉切除 B.一般胃鏡 C.沒有併發症/低風險/另加手術/急症 D. 醫院日間手術室 E.無麻醉醫生 F.住0/1晚。主要影響收費的選項及某些個案價的附加費如下：\n<=3有息肉切除<=1cm：4,700.\n<=3有息肉切除<=1cm：1,000.\n>3息肉切除,<=1cm：6,800.\n自體熒光成像(癌前損傷)：3,900.\n超細胃鏡5mm(小孩/老人)：1,700.\n膠囊內鏡：11,800.\n有併發症/高至中風險/另加手術/急症	的改費我們暫時未有案例。\n\n可以?(in sailed)');
    
  } 

  function caseConfirm(agent){
    let conv = agent.conv();
    console.log(":::::::::::in user case confirm::::::::::::");
    console.log(conv);
  
    return agent.add('而根據其他病人分享的資料，做胃鏡且收費接近中位數的醫生有：1.王大文2.陳阿文3.房小文\n個別醫生收費有異、醫療服務收費會修改、而病人情況也因人而異，這些都是影響收費的因素，如對收費有疑問請向你的醫生請教。本平台只蒐集病人個案，會力求資料正確，內容只供參考之用。未得同意，不得作其他商業用途。惟最終資料準確性，請諮詢醫生及專業人士。\n\n如有其他的查詢和分享，請輸入1；若無，請輸入2(in sail)');
    
  } 

  function end(agent){
    let conv = agent.conv();
    console.log(":::::::::::in End::::::::::::");
    console.log(conv);

    var lowerBaselinePrice
    var upperBaselinePrice
    var surgery = await db.collection('surgery').doc('58').get().then(doc => {lowerBaselinePrice= doc.data().lowerBaselinePrice;});
    var surgery1 = await db.collection('surgery').doc('58');
    var surgery = await db.collection('surgery').doc('58').get().then(doc => {upperBaselinePrice= doc.data().upperBaselinePrice;});
  
    
    console.log(lowerBaselinePrice);
    console.log(upperBaselinePrice);
    
    //agent.add(lowerBaselinePrice);
    return agent.add('多謝，請LIKE我們的FB專頁，讓更多病人明白手術收費。(in sail)\n + lowerBaseLinePrice'+lowerBaselinePrice);
    
  } 
 
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('user provide surgery', provideSurgery);
  intentMap.set('user provide doctor name', provideDoctor);
  intentMap.set('user case confirm', caseConfirm);
  intentMap.set('End', end);
  // intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
  // intentMap.set('<INTENT_NAME_HERE>', googleAssistantHandler);
  agent.handleRequest(intentMap)
  
}
/*
module.exports = function() {

  var req = this.req;
  var res = this.res;
// var surgery;
  const {WebhookClient} = require('dialogflow-fulfillment');
  const {Card, Suggestion} = require('dialogflow-fulfillment');

  const agent = new WebhookClient({request: req, response: res});

  // function welcome (agent) {
  //   agent.add(`Welcome to my agent!`);
  // }

  // function fallback (agent) {
  //   agent.add(`I didn't understand`);
  //   agent.add(`I'm sorry, can you try again?`);
  // }

  let intentMap = new Map();
  // intentMap.set('Default Welcome Intent', welcome);
  // intentMap.set('Default Fallback Intent', fallback);
  // // intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
  // // intentMap.set('<INTENT_NAME_HERE>', googleAssistantHandler);
  // agent.handleRequest(intentMap);

  intentMap.set('user provides surgery', (agent) => {
      let conv = agent.conv();
      console.log(":::::::::::::::::::::::");
      console.log(conv);
      let params = agent.parameters;
      surgery = params.surgery;
      console.log("The surgery is "+surgery);
    
      return agent.add('請輸入負責手術的醫生名字，如不知道請輸入"0"**');
      
  });
  intentMap.set('user provides doctor name', (agent) => {
      let conv = agent.conv();
      let params = agent.parameters;
      doctorName = params.doctorName;
      console.log("The doctor name is "+doctorName);
      // getFulfillmentText(agent);
      console.log("Surgery in doctor name intent: ");
      return agent.add('請問醫院名稱**');
      
  });
  intentMap.set('user provides hospital', (agent) => {
      let conv = agent.conv();
      let params = agent.parameters;
      hospital = params.hospital;
      console.log("The hospital is "+hospital);
      //console.log(">>>>"+)
      console.log("INput context is: "+ req.body.outputContexts[2].surgery);
     
      return conv.close('請輸入全單價錢(包括所有醫生/醫院收費)**');
  
  });
  intentMap.set('user provides price', (agent) => {
      let conv = agent.conv();
      let params = agent.parameters;
      price = params.price;
      console.log("The price is "+ price);
      // for(var key in surgery_summary)break;
      // var temp = surgery_summary[key];
      // console.log("11111111."+temp);
      // // var output = "所以，你地案例為下：\n"
      // // // console.log(output);
      // // console.log("@@@@@@@@");
      // // console.log(gastroscopy_summary.B);
      // // for(var key in gastroscopy_summary){
      // //     var temp = gastroscopy_summary[key];
      // //     console.log("*******"+temp);
      // //    console.log(temp[1].name);
      // //    const optionsList = list.map(item => Object.values(item)[0]);
      // // }
      // var count = 0;
      // for(var key in gastroscopy_summary){
      //     output += (abc[count] +": "+gastroscopy_summary[key][1].name+"\n");
      //     count++;
      // }
      // console.log(output);
      return conv.close("Display the surgery summary");
  
  });
  intentMap.set('user modifies details', (agent) => {
      let conv = agent.conv();
     
  });

  agent.handleRequest(intentMap);
}
*/