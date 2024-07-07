

//  let handler = async (m, { text, usedPrefix, command }) => {
//    try {
//      let result = await jodoh();
//      let teks = `- Jodoh \`@${m.quoted ? m.quoted.sender.split("@")[0] : m.sender.split("@")[0]}\` : ${result.ras}\n\n *Warnakulit* : ${result.warnakulit}\n *Warnarambut* : ${result.warnarambut}\n *Penjelasan* : ${result.penjelasan}`;

//      if (m.key.fromMe) {
//        await m.reply(teks, { edit: m.key, mentions: [m.quoted ? m.quoted.sender : m.sender] });
//      } else {
//        await m.reply(teks);
//      }
//    } catch (e) {
//      console.error(e);
//    }
//  };

//  handler.command = handler.help = ['cekjodoh','jodohsaya','jodoh'];
//  handler.tags = ['fun'];
//  handler.limit = true;

//  module.exports = handler;

//  async function jodoh() {
//                  const jodohdia = [
//                  { ras: "china", warnakulit: "sawo cerah", warnarambut:"hitam", penjelasan:"kamu akan mendapatkan jodoh dari negeri china, dia memang pintar jadi kamu harus bisa melampaui diri nya agar kamu bisa mendapatkan nya" },
//                  { ras: "jawa", warnakulit: "putih", warnarambut:"hitam", penjelasan:"kamu akan mendapatkan jodoh orang jawa yang ulet nan tekun jangan sia siakan dia sulit mendapatkan yang seperti itu" },
//                  { ras: "china", warnakulit: "sawo matang", warnarambut:"coklat", penjelasan:"biasa nya yang seperti ini campuran ras, pertahankan dan jangan sia saiakan waktu mu bersama dia" },
//                  { ras: "sunda", warnakulit: "sawo matanng", warnarambut:"hitam", penjelasan:"berhati baik, sopan dan juga pemaaf itu lah yang akan kamu dapat kan nanti" },
//                  { ras: "Aceh", warnakulit: "sawo matang", warnarambut:"coklat", penjelasan:"jodoh yang kamu dapat ini sangat sholeh dan juga penurut di tambah lagi ahli ibadah" },
//                  { ras: "Bali", warnakulit: "sawo cerah", warnarambut:"hitam", penjelasan:"kamu akan mendapatkan jodoh yang ulet dan tuken dari daerah wisata indonesia" },
//                  { ras: "Jawa", warnakulit: "sawo matang", warnarambut:"coklat", penjelasan:"pasangan yang kamu dapatkan ini berasal keluarga yang pekerja keras dan pantang menyerah " },
//                  { ras: "Jawa", warnakulit: "sawo matang", warnarambut:"hitam", penjelasan:"giat dan rajin jika kamu seperti itu kamu pantas mendapaatkan pasangan ini" },                   
//                  ];                
//    const jodohindex = Math.floor(Math.random() * jodohdia.length);
//    const jodohnya = jodohdia[jodohindex];

//    return {
//      ras: jodohnya.ras,
//      warnakulit: jodohnya.warnakulit,
//      warnarambut: jodohnya.warnarambut,
//      penjelasan: jodohnya.penjelasan,
//    };
//  }

function _0x1d16(){const _0x56c563=['limit','giat\x20dan\x20rajin\x20jika\x20kamu\x20seperti\x20itu\x20kamu\x20pantas\x20mendapaatkan\x20pasangan\x20ini','exports','Bali','berhati\x20baik,\x20sopan\x20dan\x20juga\x20pemaaf\x20itu\x20lah\x20yang\x20akan\x20kamu\x20dapat\x20kan\x20nanti','5112095hFVaWK','penjelasan','\x0a\x20*Penjelasan*\x20:\x20','sawo\x20matanng','11156967aCWcbn','ras','6947556XWVQfD','tags','key','sawo\x20cerah','help','putih','random','fromMe','18QJWzoy','6954199izSTow','split','china','biasa\x20nya\x20yang\x20seperti\x20ini\x20campuran\x20ras,\x20pertahankan\x20dan\x20jangan\x20sia\x20saiakan\x20waktu\x20mu\x20bersama\x20dia','sawo\x20matang','jodohsaya','sunda','reply','warnarambut','4YymPrV','Jawa','warnakulit','hitam','\x0a\x0a\x20*Warnakulit*\x20:\x20','length','1080856yMqyjc','quoted','sender','jodoh','3518304AsakFb','jodoh\x20yang\x20kamu\x20dapat\x20ini\x20sangat\x20sholeh\x20dan\x20juga\x20penurut\x20di\x20tambah\x20lagi\x20ahli\x20ibadah','Aceh','jawa','81471GYlDUD','coklat'];_0x1d16=function(){return _0x56c563;};return _0x1d16();}const _0x5ebbd5=_0x3c82;(function(_0x4806da,_0x579809){const _0x3abbbb=_0x3c82,_0xc1109f=_0x4806da();while(!![]){try{const _0x12e60a=-parseInt(_0x3abbbb(0x1e4))/0x1+-parseInt(_0x3abbbb(0x1d4))/0x2*(-parseInt(_0x3abbbb(0x1bf))/0x3)+-parseInt(_0x3abbbb(0x1de))/0x4*(-parseInt(_0x3abbbb(0x1c6))/0x5)+-parseInt(_0x3abbbb(0x1cc))/0x6+parseInt(_0x3abbbb(0x1d5))/0x7+-parseInt(_0x3abbbb(0x1bb))/0x8+parseInt(_0x3abbbb(0x1ca))/0x9;if(_0x12e60a===_0x579809)break;else _0xc1109f['push'](_0xc1109f['shift']());}catch(_0x5894dc){_0xc1109f['push'](_0xc1109f['shift']());}}}(_0x1d16,0xc8886));function _0x3c82(_0x2918b8,_0x24bb31){const _0x1d1643=_0x1d16();return _0x3c82=function(_0x3c82e9,_0x40da59){_0x3c82e9=_0x3c82e9-0x1ba;let _0x281c35=_0x1d1643[_0x3c82e9];return _0x281c35;},_0x3c82(_0x2918b8,_0x24bb31);}let handler=async(_0x41f55a,{text:_0x335581,usedPrefix:_0x5b73f3,command:_0x3272ae})=>{const _0x42ba04=_0x3c82;try{let _0x3a125a=await jodoh(),_0x1ab65c='-\x20Jodoh\x20`@'+(_0x41f55a[_0x42ba04(0x1e5)]?_0x41f55a[_0x42ba04(0x1e5)][_0x42ba04(0x1e6)][_0x42ba04(0x1d6)]('@')[0x0]:_0x41f55a[_0x42ba04(0x1e6)][_0x42ba04(0x1d6)]('@')[0x0])+'`\x20:\x20'+_0x3a125a[_0x42ba04(0x1cb)]+_0x42ba04(0x1e2)+_0x3a125a[_0x42ba04(0x1e0)]+'\x0a\x20*Warnarambut*\x20:\x20'+_0x3a125a[_0x42ba04(0x1dd)]+_0x42ba04(0x1c8)+_0x3a125a[_0x42ba04(0x1c7)];_0x41f55a[_0x42ba04(0x1ce)][_0x42ba04(0x1d3)]?await _0x41f55a[_0x42ba04(0x1dc)](_0x1ab65c,{'edit':_0x41f55a['key'],'mentions':[_0x41f55a[_0x42ba04(0x1e5)]?_0x41f55a[_0x42ba04(0x1e5)][_0x42ba04(0x1e6)]:_0x41f55a[_0x42ba04(0x1e6)]]}):await _0x41f55a[_0x42ba04(0x1dc)](_0x1ab65c);}catch(_0x39b83a){console['error'](_0x39b83a);}};handler['command']=handler[_0x5ebbd5(0x1d0)]=['cekjodoh',_0x5ebbd5(0x1da),_0x5ebbd5(0x1ba)],handler[_0x5ebbd5(0x1cd)]=['fun'],handler[_0x5ebbd5(0x1c1)]=!![],module[_0x5ebbd5(0x1c3)]=handler;async function jodoh(){const _0x3837cd=_0x5ebbd5,_0x4d2d79=[{'ras':_0x3837cd(0x1d7),'warnakulit':_0x3837cd(0x1cf),'warnarambut':'hitam','penjelasan':'kamu\x20akan\x20mendapatkan\x20jodoh\x20dari\x20negeri\x20china,\x20dia\x20memang\x20pintar\x20jadi\x20kamu\x20harus\x20bisa\x20melampaui\x20diri\x20nya\x20agar\x20kamu\x20bisa\x20mendapatkan\x20nya'},{'ras':_0x3837cd(0x1be),'warnakulit':_0x3837cd(0x1d1),'warnarambut':_0x3837cd(0x1e1),'penjelasan':'kamu\x20akan\x20mendapatkan\x20jodoh\x20orang\x20jawa\x20yang\x20ulet\x20nan\x20tekun\x20jangan\x20sia\x20siakan\x20dia\x20sulit\x20mendapatkan\x20yang\x20seperti\x20itu'},{'ras':_0x3837cd(0x1d7),'warnakulit':_0x3837cd(0x1d9),'warnarambut':'coklat','penjelasan':_0x3837cd(0x1d8)},{'ras':_0x3837cd(0x1db),'warnakulit':_0x3837cd(0x1c9),'warnarambut':_0x3837cd(0x1e1),'penjelasan':_0x3837cd(0x1c5)},{'ras':_0x3837cd(0x1bd),'warnakulit':_0x3837cd(0x1d9),'warnarambut':'coklat','penjelasan':_0x3837cd(0x1bc)},{'ras':_0x3837cd(0x1c4),'warnakulit':_0x3837cd(0x1cf),'warnarambut':_0x3837cd(0x1e1),'penjelasan':'kamu\x20akan\x20mendapatkan\x20jodoh\x20yang\x20ulet\x20dan\x20tuken\x20dari\x20daerah\x20wisata\x20indonesia'},{'ras':_0x3837cd(0x1df),'warnakulit':_0x3837cd(0x1d9),'warnarambut':_0x3837cd(0x1c0),'penjelasan':'pasangan\x20yang\x20kamu\x20dapatkan\x20ini\x20berasal\x20keluarga\x20yang\x20pekerja\x20keras\x20dan\x20pantang\x20menyerah\x20'},{'ras':_0x3837cd(0x1df),'warnakulit':_0x3837cd(0x1d9),'warnarambut':_0x3837cd(0x1e1),'penjelasan':_0x3837cd(0x1c2)}],_0x26faa5=Math['floor'](Math[_0x3837cd(0x1d2)]()*_0x4d2d79[_0x3837cd(0x1e3)]),_0xd49168=_0x4d2d79[_0x26faa5];return{'ras':_0xd49168[_0x3837cd(0x1cb)],'warnakulit':_0xd49168[_0x3837cd(0x1e0)],'warnarambut':_0xd49168['warnarambut'],'penjelasan':_0xd49168[_0x3837cd(0x1c7)]};}