import {createContext,useContext,useEffect,useState} from 'react';
import {api,API} from './api.js';
const EMPTY={};
const Ctx=createContext(EMPTY);
export const useSettings=()=>useContext(Ctx);
// Je kono public list (banners, faqs, testimonials, gallery) anar jonno: const faqs=useList('faqs')
export const useList=path=>{const [d,setD]=useState([]);useEffect(()=>{api('/api/'+path).then(setD).catch(()=>{})},[path]);return d};
export const wa=(s,text='')=>`https://wa.me/${(s.whatsapp||'').replace(/\D/g,'')}${text?'?text='+encodeURIComponent(text):''}`;

/* Settings cache: dwitiyo bar theke site sathe sathe settings pay, loading lage na */
const KEY='bpl_settings';
const readCache=()=>{try{return JSON.parse(localStorage.getItem(KEY))}catch{return null}};
// index.html er intro ke janay je app ready (settings ashche ba fail hoyeche)
const markReady=()=>{window.__appReady=true;window.dispatchEvent(new Event('app:ready'))};

export function SettingsProvider({children}){
 const [s,setS]=useState(readCache);
 useEffect(()=>{
  let alive=true;
  api('/api/settings')
   .then(d=>{if(!alive)return;setS(d);try{localStorage.setItem(KEY,JSON.stringify(d))}catch{}})
   .catch(()=>{if(alive)setS(p=>p||{})})
   .finally(markReady);
  return()=>{alive=false};
 },[]);
 useEffect(()=>{if(!s)return;if(s.seoTitle)document.title=s.seoTitle;
  let m=document.querySelector('meta[name=description]');if(!m){m=document.createElement('meta');m.name='description';document.head.appendChild(m)}
  if(s.seoDescription)m.content=s.seoDescription},[s]);
 // "লোড হচ্ছে..." screen ar nei: settings na ashar agei site render hoy (intro oi somoy ta dhheke rakhe)
 if(s?.maintenance&&!location.pathname.startsWith('/admin'))return <div className="flex min-h-screen items-center justify-center p-6 text-center text-xl">{s.maintenanceMsg}</div>;
 return <Ctx.Provider value={s||EMPTY}>{children}</Ctx.Provider>}