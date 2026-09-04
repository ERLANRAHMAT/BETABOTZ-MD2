import { Buffer } from "buffer";

export let handler = async (m, { conn }) => {
  // Menyimpan seluruh HTML, CSS, dan JS ke dalam variabel
  const snakeHtml = `<style>*{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none} .btn{background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:12px; width:60px; height:60px; display:flex; justify-content:center; align-items:center; font-size:28px; margin:4px; box-shadow:0 4px 10px rgba(0,0,0,0.3); transition:transform 0.1s;} .btn:active{transform:scale(0.9); background:rgba(255,255,255,0.2);}</style>
<body style="margin:0;background:transparent;font-family:Arial,sans-serif;color:#eee;touch-action:manipulation;cursor:pointer">
<div style="width:100%;max-width:620px;margin:auto;padding:16px;box-sizing:border-box">
<div style="background:rgba(255,255,255,.06);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.15);border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.35)">
<div style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;align-items:center">
<div><div style="font-size:11px;letter-spacing:1.5px;color:rgba(255,255,255,.45)">CHISA GAMES</div><div style="font-size:21px;font-weight:bold;color:#fff">Snake Game</div></div>
<div style="text-align:right"><div id="score" style="font-size:18px;font-weight:bold;color:#fff;text-shadow:0 0 10px rgba(46,204,113,.85)">00000</div><div id="best" style="font-size:10px;color:rgba(255,255,255,.4);margin-top:2px">BEST 00000</div></div>
</div>
<div style="padding:18px">
<canvas id="game" width="400" height="400" style="width:100%;height:auto;aspect-ratio:1/1;background:#0f172a;border:1px solid rgba(255,255,255,.12);border-radius:12px;display:block"></canvas>
<div style="margin-top:20px;display:flex;flex-direction:column;align-items:center;">
  <div style="display:flex;justify-content:center;"><div class="btn" id="btnU">⬆️</div></div>
  <div style="display:flex;justify-content:center;">
    <div class="btn" id="btnL">⬅️</div>
    <div class="btn" id="btnD">⬇️</div>
    <div class="btn" id="btnR">➡️</div>
  </div>
</div>
</div></div></div>
<script>
const c=document.getElementById('game'), x=c.getContext('2d'), scoreEl=document.getElementById('score'), bestEl=document.getElementById('best');
const grid=20; let count=0, score=0, best=0, over=true, changing=false;
let snake={x:160, y:160, dx:grid, dy:0, cells:[], max:4};
let apple={x:80, y:80};

function loadB(){try{let v=localStorage.getItem('sn_best');return v?parseInt(v):0;}catch(e){return 0;}}
function saveB(v){try{localStorage.setItem('sn_best',v.toString());}catch(e){}}
best=loadB(); bestEl.textContent='BEST '+String(best).padStart(5,'0');

function rand(min,max){return Math.floor(Math.random()*(max-min))+min;}
function spawn(){
  let valid=false;
  while(!valid){
    apple.x=rand(0,c.width/grid)*grid; apple.y=rand(0,c.height/grid)*grid;
    valid=true;
    for(let i=0;i<snake.cells.length;i++){if(apple.x===snake.cells[i].x&&apple.y===snake.cells[i].y){valid=false;break;}}
  }
}
function drawOverlay(t,s){
  x.fillStyle="rgba(15,23,42,0.85)"; x.fillRect(0,0,c.width,c.height);
  x.fillStyle=t==="GAME OVER"?"#e74c3c":"#2ecc71";
  x.font="bold 36px Arial"; x.textAlign="center"; x.fillText(t,c.width/2,c.height/2-10);
  x.fillStyle="#ccc"; x.font="16px Arial"; x.fillText(s,c.width/2,c.height/2+25);
}
function reset(){
  if(!over)return;
  snake={x:160,y:160,dx:grid,dy:0,cells:[],max:4}; score=0; scoreEl.textContent="00000";
  spawn(); over=false; changing=false;
}
function loop(){
  requestAnimationFrame(loop);
  if(over)return;
  if(++count<8)return; // Kecepatan game
  count=0; changing=false;
  snake.x+=snake.dx; snake.y+=snake.dy;
  
  if(snake.x<0||snake.x>=c.width||snake.y<0||snake.y>=c.height){over=true; if(score>best){best=score;saveB(best);bestEl.textContent='BEST '+String(best).padStart(5,'0');} drawOverlay("GAME OVER","Tap layar untuk mulai"); return;}
  snake.cells.unshift({x:snake.x,y:snake.y});
  
  if(snake.x===apple.x&&snake.y===apple.y){snake.max++; score+=10; scoreEl.textContent=String(score).padStart(5,'0'); spawn();}
  if(snake.cells.length>snake.max)snake.cells.pop();
  for(let i=1;i<snake.cells.length;i++){if(snake.x===snake.cells[i].x&&snake.y===snake.cells[i].y){over=true; if(score>best){best=score;saveB(best);bestEl.textContent='BEST '+String(best).padStart(5,'0');} drawOverlay("GAME OVER","Tap layar untuk mulai"); return;}}
  
  x.clearRect(0,0,c.width,c.height);
  for(let i=0;i<c.width;i+=grid)for(let j=0;j<c.height;j+=grid){x.fillStyle="rgba(255,255,255,0.02)";x.fillRect(i,j,grid-1,grid-1);}
  
  // MENGGAMBAR APEL (Real Graphic)
  let ax = apple.x + grid/2;
  let ay = apple.y + grid/2;
  x.fillStyle = "#e74c3c"; // Merah apel
  x.beginPath(); x.arc(ax, ay+1, grid/2-2, 0, Math.PI*2); x.fill();
  x.fillStyle = "#ff7979"; // Pantulan cahaya
  x.beginPath(); x.arc(ax-3, ay-2, 3, 0, Math.PI*2); x.fill();
  x.fillStyle = "#2ecc71"; //  hijau
  x.beginPath(); x.moveTo(ax, ay-4); x.quadraticCurveTo(ax+5, ay-10, ax+8, ay-6); x.quadraticCurveTo(ax+4, ay-2, ax, ay-4); x.fill();

  // MENGGAMBAR ULAR 
  if(snake.cells.length > 0) {
      x.beginPath();
      x.moveTo(snake.cells[0].x + grid/2, snake.cells[0].y + grid/2);
      for(let i=1; i<snake.cells.length; i++) {
          x.lineTo(snake.cells[i].x + grid/2, snake.cells[i].y + grid/2);
      }
      // Stroke luar (hijau gelap)
      x.strokeStyle = "#27ae60";
      x.lineWidth = grid - 2;
      x.lineCap = "round";
      x.lineJoin = "round";
      x.stroke();
      // Stroke dalam (hijau terang)
      x.strokeStyle = "#2ecc71";
      x.lineWidth = grid - 6;
      x.stroke();

      let hx = snake.cells[0].x + grid/2;
      let hy = snake.cells[0].y + grid/2;
      let eo = grid/4; // eye offset
      let es = grid/7; // eye size
      x.fillStyle = "white"; // Mata putih
      if(snake.dx > 0) { // Kanan
          x.beginPath(); x.arc(hx+eo, hy-eo, es, 0, Math.PI*2); x.fill();
          x.beginPath(); x.arc(hx+eo, hy+eo, es, 0, Math.PI*2); x.fill();
          x.fillStyle="black"; x.beginPath(); x.arc(hx+eo+2, hy-eo, es/2, 0, Math.PI*2); x.fill(); x.beginPath(); x.arc(hx+eo+2, hy+eo, es/2, 0, Math.PI*2); x.fill();
      } else if(snake.dx < 0) { // Kiri
          x.beginPath(); x.arc(hx-eo, hy-eo, es, 0, Math.PI*2); x.fill();
          x.beginPath(); x.arc(hx-eo, hy+eo, es, 0, Math.PI*2); x.fill();
          x.fillStyle="black"; x.beginPath(); x.arc(hx-eo-2, hy-eo, es/2, 0, Math.PI*2); x.fill(); x.beginPath(); x.arc(hx-eo-2, hy+eo, es/2, 0, Math.PI*2); x.fill();
      } else if(snake.dy < 0) { // Atas
          x.beginPath(); x.arc(hx-eo, hy-eo, es, 0, Math.PI*2); x.fill();
          x.beginPath(); x.arc(hx+eo, hy-eo, es, 0, Math.PI*2); x.fill();
          x.fillStyle="black"; x.beginPath(); x.arc(hx-eo, hy-eo-2, es/2, 0, Math.PI*2); x.fill(); x.beginPath(); x.arc(hx+eo, hy-eo-2, es/2, 0, Math.PI*2); x.fill();
      } else if(snake.dy > 0) { // Bawah
          x.beginPath(); x.arc(hx-eo, hy+eo, es, 0, Math.PI*2); x.fill();
          x.beginPath(); x.arc(hx+eo, hy+eo, es, 0, Math.PI*2); x.fill();
          x.fillStyle="black"; x.beginPath(); x.arc(hx-eo, hy+eo+2, es/2, 0, Math.PI*2); x.fill(); x.beginPath(); x.arc(hx+eo, hy+eo+2, es/2, 0, Math.PI*2); x.fill();
      }
  }
}
c.addEventListener("pointerdown",reset);
function go(dir){
  if(over)reset();
  else if(!changing){
    if(dir==='U'&&snake.dy===0){snake.dy=-grid;snake.dx=0;changing=true;}
    if(dir==='D'&&snake.dy===0){snake.dy=grid;snake.dx=0;changing=true;}
    if(dir==='L'&&snake.dx===0){snake.dx=-grid;snake.dy=0;changing=true;}
    if(dir==='R'&&snake.dx===0){snake.dx=grid;snake.dy=0;changing=true;}
  }
}
document.getElementById('btnU').addEventListener('pointerdown',()=>go('U'));
document.getElementById('btnD').addEventListener('pointerdown',()=>go('D'));
document.getElementById('btnL').addEventListener('pointerdown',()=>go('L'));
document.getElementById('btnR').addEventListener('pointerdown',()=>go('R'));
drawOverlay("SNAKE GAME","Tap kotak untuk main");
requestAnimationFrame(loop);
</script></body>`;

  // Payload
  await conn.relayMessage(
    m.chat,
    {
      messageContextInfo: {
        deviceListMetadata: {},
        deviceListMetadataVersion: 2,
        botMetadata: {
          messageDisclaimerText: "",
          botResponseId: "b2e40280-433c-45d8-9c1a-270bec558860",
          verificationMetadata: {
            proofs: [
              {
                version: 1,
                useCase: 1,
                signature:
                  "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==",
                certificateChain: [
                  "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg",
                  "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==",
                ],
              },
            ],
          },
        },
      },
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            submessages: [
              {
                messageType: 2,
                messageText: "Fiora Sylvie",
              },
            ],
            unifiedResponse: {
              data: Buffer.from(
                JSON.stringify({
                  response_id: "4db57b2c-8393-484d-8b9a-8e6d1a14b349",
                  sections: [
                    {
                      view_model: {
                        primitive: {
                          __typename: "GenAIaeacdsnwHtmlPrimitive",
                          payload: snakeHtml,
                          trusted_sources: ["nixel.dev"],
                        },
                        __typename: "GenAISingleLayoutViewModel",
                      },
                    },
                  ],
                }),
              ).toString("base64"),
            },
            contextInfo: {
              forwardingScore: 1,
              isForwarded: true,
              forwardedAiBotMessageInfo: {
                botJid: "867051314767696@bot",
              },
              forwardOrigin: 4,
            },
          },
        },
      },
    },
    {},
  );
};

handler.help = ["snake"];
handler.tags = ["game"];
handler.command = /^(snake|snakegame)$/i;

export default handler;
