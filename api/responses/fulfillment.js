module.exports = function () {

  var req = this.req;
  var res = this.res;

  const { WebhookClient } = require('dialogflow-fulfillment');
  // const {Card, Suggestion} = require('dialogflow-fulfillment');

  const agent = new WebhookClient({ request: req, response: res });
  var db = sails.firebaseAdmin.firestore();

  async function welcome(agent) {
    agent.add(`你好~我是病不孤單人工客服，免費幫您按預算找專科手術醫生，以及提供數據讓你更了解你的手術收費。請問你想查詢甚麼手術? (in sail )`);
  }

  async function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

// get the price via the general option id and specific option id
  async function provideSurgery(agent){
    let conv = agent.conv();
    console.log("::::::::in user provide surgery:::::::::::::::");
    console.log(conv);
    let params = agent.parameters;
     surgery = params.surgery;
    console.log("The surgery is "+surgery);
    return agent.add('請輸入負責手術的醫生名字，如不知道請輸入"0"**(in sailed)');
  }

  async function provideDoctor(agent){
    let conv = agent.conv();
    console.log(":::::::::::in user provide doctor name::::::::::::");
    console.log(conv);

    

    return agent.add('胃鏡基線案例收費通常為8300至13300，基線案例：A.沒息肉切除 B.一般胃鏡 C.沒有併發症/低風險/另加手術/急症 D. 醫院日間手術室 E.無麻醉醫生 F.住0/1晚。主要影響收費的選項及某些個案價的附加費如下：\n<=3有息肉切除<=1cm：4,700.\n<=3有息肉切除<=1cm：1,000.\n>3息肉切除,<=1cm：6,800.\n自體熒光成像(癌前損傷)：3,900.\n超細胃鏡5mm(小孩/老人)：1,700.\n膠囊內鏡：11,800.\n有併發症/高至中風險/另加手術/急症	的改費我們暫時未有案例。\n\n可以?(in sailed)');
    
  } 

  async function caseConfirm(agent){
    let conv = agent.conv();
    console.log(":::::::::::in user case confirm::::::::::::");
    console.log(conv);
    

    return agent.add('而根據其他病人分享的資料，做胃鏡且收費接近中位數的醫生有：1.王大文2.陳阿文3.房小文\n個別醫生收費有異、醫療服務收費會修改、而病人情況也因人而異，這些都是影響收費的因素，如對收費有疑問請向你的醫生請教。本平台只蒐集病人個案，會力求資料正確，內容只供參考之用。未得同意，不得作其他商業用途。惟最終資料準確性，請諮詢醫生及專業人士。\n\n如有其他的查詢和分享，請輸入1；若無，請輸入2(in sail)');
    
  } 

  async function end(agent){
     let conv = agent.conv();
     console.log(":::::::::::in End::::::::::::");
     console.log(conv);

    // var lowerBaselinePrice
    // var upperBaselinePrice
    // var surgery = await db.collection('surgery').doc('58').get().then(doc => {lowerBaselinePrice= doc.data().lowerBaselinePrice;});
    // var surgery1 = await db.collection('surgery').doc('58');
    // var surgery = await db.collection('surgery').doc('58').get().then(doc => {upperBaselinePrice= doc.data().upperBaselinePrice;});
  
    
    // console.log(lowerBaselinePrice);
    // console.log(upperBaselinePrice);
    // tryrtryrytryr

      var lowerBaselinePrice
      var upperBaselinePrice
      var surgery = await db.collection('surgery').doc('58');
      var general = await db.collection('general').doc('option').get();
      var surgeryOptions = await surgery.collection('option').get()
      surgeryOptions.forEach(element => {
          console.log(element.id);
          console.log(element.data())
      });
      
      var surgery = await db.collection('surgery').doc('58').get();
      lowerBaselinePrice = surgery.data().lowerBaselinePrice
      upperBaselinePrice = surgery.data().upperBaselinePrice

      console.log(">>>>>>>"+lowerBaselinePrice);
      console.log(">>>>>>>>"+upperBaselinePrice);
      
      var myoutputcontexts = agent.getContext('myoutputcontexts');
      // console.log('myoutputcontexts: '+myoutputcontexts);
      var contextSurgery = myoutputcontexts.parameters.surgery;
      console.log(contextSurgery);
      var surgery = await db.collection('surgery').doc(contextSurgery).get();

        // Get a value of a field of the doc.
        var ChineseName = surgery.data()['內容'];
        console.log("ChiNAme is " + ChineseName);
      

    return agent.add('多謝，請LIKE我們的FB專頁，讓更多病人明白手術收費。(in sail)\n + lowerBaseLinePrice '+lowerBaselinePrice);
    
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