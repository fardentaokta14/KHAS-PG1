const STUDENTS=['Agata', 'Elang', 'Alman', 'Bintang', 'Dimas', 'Okta', 'Rama', 'Ganim', 'Hazel', 'Kenzi', 'Kenzo', 'Kyan', 'Lambang', 'Ainur', 'Faiq', 'Gilang', 'Hisyam', 'Lutfi', 'Rifqi', 'Javabir', 'Raffi', 'Rendra', 'Risyad', 'Tobat', 'Miko', 'Zaidan'];
const PASSWORD="XPG1OKTA2026";
const KEY="kas_xpg1_modern_v2";
let payments=JSON.parse(localStorage.getItem(KEY)||"[]");
let method="QRIS";
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function save(){localStorage.setItem(KEY,JSON.stringify(payments));render();}
function latest(n){return payments.filter(p=>p.name===n).sort((a,b)=>b.time-a.time)[0]}
function state(n){return latest(n)?.status||"unpaid"}
function pill(s){return `<span class="pill ${s}">${s==="paid"?"Sudah bayar":s==="pending"?"Menunggu":s==="rejected"?"Ditolak":"Belum bayar"}</span>`}
function selects(){$("student").innerHTML='<option value="">-- Pilih nama siswa --</option>'+STUDENTS.map(n=>`<option>${n}</option>`).join("");$("statusSelect").innerHTML='<option value="">-- Pilih nama siswa --</option>'+STUDENTS.map(n=>`<option>${n}</option>`).join("")}
function renderStats(){let p=STUDENTS.filter(n=>state(n)==="paid").length,q=STUDENTS.filter(n=>state(n)==="pending").length;$("total").textContent=26;$("paid").textContent=p;$("pending").textContent=q;$("unpaid").textContent=26-p-q}
function renderMembers(){let q=$("search").value.toLowerCase();$("members").innerHTML='<div class="members-list">'+STUDENTS.filter(n=>n.toLowerCase().includes(q)).map(n=>`<div class="member"><div><b>${esc(n)}</b><small>${latest(n)?new Date(latest(n).time).toLocaleString("id-ID"):"Belum ada pengajuan"}</small></div>${pill(state(n))}</div>`).join("")+'</div>'}
function renderStatus(){let n=$("statusSelect").value;if(!n){$("statusBox").className="status-empty";$("statusBox").textContent="Pilih nama untuk melihat status pembayaran.";return}let p=latest(n);$("statusBox").className="status-result";$("statusBox").innerHTML=p?`<b>${esc(n)}</b> ${pill(p.status)}<p>Metode: ${esc(p.method)} • ${new Date(p.time).toLocaleString("id-ID")}${p.note?" • "+esc(p.note):""}</p>`:`<b>${esc(n)}</b> ${pill("unpaid")}<p>Belum ada pengajuan pembayaran.</p>`}
function renderAdmin(){let arr=[...payments].sort((a,b)=>b.time-a.time);$("adminList").innerHTML=arr.length?arr.map(p=>`<div class="admin-item"><b>${esc(p.name)}</b> ${pill(p.status)}<p>Rp5.000 • ${esc(p.method)} • ${new Date(p.time).toLocaleString("id-ID")}</p>${p.note?`<p>Catatan: ${esc(p.note)}</p>`:""}${p.proofName?`<p>File bukti: ${esc(p.proofName)}</p>`:""}${p.status==="pending"?`<div class="admin-actions"><button class="accept" onclick="verify('${p.id}','paid')">✓ Terima</button><button class="reject" onclick="verify('${p.id}','rejected')">✕ Tolak</button></div>`:""}</div>`).join(""):'<div class="empty-admin">Belum ada pengajuan pembayaran.</div>'}
function render(){renderStats();renderMembers();renderStatus();if(!$("admin").classList.contains("hidden"))renderAdmin()}
function toast(m){let t=$("toast");t.textContent=m;t.classList.remove("hidden");setTimeout(()=>t.classList.add("hidden"),2500)}
window.verify=(id,s)=>{let p=payments.find(x=>x.id===id);if(!p)return;p.status=s;p.verifiedAt=Date.now();save();toast(s==="paid"?"Pembayaran diterima ✓":"Pembayaran ditolak.")}
selects();render();
document.querySelectorAll(".method").forEach(b=>b.onclick=()=>{document.querySelectorAll(".method").forEach(x=>x.classList.remove("active"));b.classList.add("active");method=b.dataset.method;$("qris").classList.toggle("hidden",method!=="QRIS");$("cash").classList.toggle("hidden",method!=="Cash")});
$("submit").onclick=()=>{let n=$("student").value;if(!n)return toast("Pilih nama siswa terlebih dahulu.");let old=latest(n);if(old?.status==="pending")return toast("Pengajuan siswa ini masih menunggu verifikasi.");let f=$("proof").files[0];payments.push({id:Date.now()+"-"+Math.random(),name:n,method,note:$("note").value.trim(),proofName:f?.name||"",status:"pending",time:Date.now()});save();$("student").value="";$("note").value="";$("proof").value="";toast("Pengajuan berhasil dikirim ✓")};
$("statusSelect").onchange=renderStatus;$("search").oninput=renderMembers;
$("adminOpen").onclick=()=>{$("modal").classList.remove("hidden");$("login").classList.remove("hidden");$("admin").classList.add("hidden");$("password").value="";$("error").textContent=""};
$("close").onclick=()=>$("modal").classList.add("hidden");
$("loginBtn").onclick=()=>{if($("password").value===PASSWORD){$("login").classList.add("hidden");$("admin").classList.remove("hidden");renderAdmin()}else $("error").textContent="Password salah. Silakan coba lagi."};
$("logout").onclick=()=>{$("admin").classList.add("hidden");$("login").classList.remove("hidden")};
