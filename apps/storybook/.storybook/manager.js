import React, { useState } from 'react';
import { addons, types, useGlobals } from 'storybook/internal/manager-api';
import { IconButton, WithTooltip } from 'storybook/internal/components';
import { create } from '@storybook/theming/create';
import { generateCSS, generateJSON, generateJSModule, generateSDConfig, downloadFile, COMPONENT_TOKENS, COMPONENT_GLOBAL_KEYS } from './themeExport.js';

/* ─── Storybook theme ───────────────────────────────────────────────────────── */

const theme = create({
  base: 'light',
  brandTitle: ' ', brandUrl: '/', brandImage: '/Tao.svg', brandTarget: '_self',
  colorPrimary: '#2563EB', colorSecondary: '#2563EB',
  appBg: '#f5f5f5', appContentBg: '#ffffff', appPreviewBg: '#ffffff',
  appBorderColor: '#e5e5e5', appBorderRadius: 8,
  textColor: '#171717', textInverseColor: '#ffffff', textMutedColor: '#737373',
  barTextColor: '#737373', barHoverColor: '#2563EB', barSelectedColor: '#2563EB', barBg: '#ffffff',
  inputBg: '#ffffff', inputBorder: '#e5e5e5', inputTextColor: '#171717', inputBorderRadius: 6,
  buttonBg: '#ffffff', buttonBorder: '#e5e5e5', booleanBg: '#f5f5f5', booleanSelectedBg: '#2563EB',
});

addons.setConfig({ theme });

/* ─── Shared constants ──────────────────────────────────────────────────────── */

const PALETTE_KEYS = [
  'palette-1','palette-2','palette-3','palette-4','palette-5','palette-6',
  'palette-7','palette-8','palette-9','palette-10','palette-11',
];

const PALETTE_LABELS = {
  'palette-1':'Brand 1','palette-2':'Brand 2','palette-3':'Brand 3','palette-4':'Brand 4',
  'palette-5':'Brand 5','palette-6':'Brand 6','palette-7':'Brand 7','palette-8':'Brand 8',
  'palette-9':'Brand 9','palette-10':'Brand 10','palette-11':'Brand 11',
};

const DEFAULT_PALETTE = {
  'palette-1':'#2563EB','palette-2':'#4F46E5','palette-3':'#7C3AED','palette-4':'#DB2777',
  'palette-5':'#DC2626','palette-6':'#EA580C','palette-7':'#D97706','palette-8':'#16A34A',
  'palette-9':'#0D9488','palette-10':'#0891B2','palette-11':'#525252',
};

const DEFAULT_TYPESCALE      = '1.2';
const DEFAULT_TYPESCALE_BASE = '16';
const DEFAULT_DENSITY        = '1';
const DEFAULT_ICON_WEIGHT    = 'regular';

const ICON_WEIGHTS = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];

const TYPESCALE_NAMES = {
  '1.067':'Minor Second','1.125':'Major Second','1.2':'Minor Third',
  '1.25':'Major Third','1.333':'Perfect Fourth','1.618':'Golden Ratio',
};

const DENSITY_NAMES = { '1':'Comfortable','0.75':'Compact','0.5':'Dense' };

const STORAGE_KEY = 'tao-saved-themes';

/* ─── Shared helpers ────────────────────────────────────────────────────────── */

const SIZE_STEPS = [
  {key:'xs',step:-2},{key:'sm',step:-1},{key:'md',step:0},
  {key:'lg',step:1},{key:'xl',step:2},{key:'xxl',step:3},{key:'xxxl',step:4},
];
const SPACING_BASE = {xxs:4,xs:8,sm:12,md:16,lg:24,xl:32,xxl:48,xxxl:64};

function generateTypeScale(ratio, base = 16) {
  return SIZE_STEPS.map(({key,step}) => ({key, value: Math.round(base * Math.pow(ratio, step)) + 'px'}));
}
function generateSpacing(factor) {
  return Object.entries(SPACING_BASE).map(([key,base]) => ({key, value: Math.round(base * factor) + 'px'}));
}

function snapshotGlobals(globals) {
  return {
    palette:         Object.fromEntries(PALETTE_KEYS.map(k => [k, globals[k] || DEFAULT_PALETTE[k]])),
    typescale:       globals.typescale     || DEFAULT_TYPESCALE,
    typescaleBase:   globals.typescaleBase || DEFAULT_TYPESCALE_BASE,
    density:         globals.density       || DEFAULT_DENSITY,
    iconWeight:      globals.iconWeight    || DEFAULT_ICON_WEIGHT,
    componentTokens: Object.fromEntries(COMPONENT_GLOBAL_KEYS.filter(k => globals[k]).map(k => [k, globals[k]])),
  };
}

function applyConfig(config, updateGlobals) {
  updateGlobals({
    ...config.palette,
    typescale:     config.typescale,
    typescaleBase: config.typescaleBase,
    density:       config.density,
    iconWeight:    config.iconWeight || DEFAULT_ICON_WEIGHT,
    ...Object.fromEntries(COMPONENT_GLOBAL_KEYS.map(k => [k, config.componentTokens?.[k] || ''])),
  });
}

function loadThemes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveThemes(themes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
}

/* ─── Shared styles ─────────────────────────────────────────────────────────── */

const s = {
  wrapper:    {fontFamily:"'DM Sans',-apple-system,sans-serif",minWidth:260,maxWidth:320,padding:'10px 0 8px'},
  header:     {display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 14px 10px',borderBottom:'1px solid #e5e5e5'},
  title:      {fontSize:12,fontWeight:600,color:'#171717',margin:0},
  actionBtn:  {fontSize:11,fontWeight:500,color:'#2563EB',background:'none',border:'none',cursor:'pointer',padding:'2px 6px',borderRadius:4},
  empty:      {padding:'12px 14px',fontSize:12,color:'#737373'},
  section:    {padding:'8px 0 0'},
  sectionHdr: {padding:'4px 14px',fontSize:10,fontWeight:600,color:'#a3a3a3',textTransform:'uppercase',letterSpacing:'0.05em'},
  row:        {display:'flex',alignItems:'center',gap:6,padding:'4px 14px'},
  rowLabel:   {flex:1,fontSize:12,color:'#525252'},
  badge:      {fontSize:11,fontWeight:500,color:'#171717',background:'#f5f5f5',border:'1px solid #e5e5e5',borderRadius:4,padding:'1px 5px'},
  badgeMuted: {fontSize:11,color:'#a3a3a3'},
  arrow:      {fontSize:10,color:'#a3a3a3'},
  divider:    {borderTop:'1px solid #e5e5e5',margin:'6px 0 0'},
  grid:       {display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2px 0',padding:'4px 14px 6px'},
  gridRow:    {display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#525252',padding:'2px 0'},
  gridKey:    {width:32,color:'#a3a3a3',fontSize:10,fontWeight:500},
};

function Swatch({color}) {
  return React.createElement('span', {style:{display:'inline-block',width:14,height:14,borderRadius:3,background:color,border:'1px solid rgba(0,0,0,0.12)',flexShrink:0}});
}
function SectionHeader({label}) {
  return React.createElement('div', {style:s.sectionHdr}, label);
}
function Divider() {
  return React.createElement('div', {style:s.divider});
}

/* ════════════════════════════════════════════════════════════════════════════
   OVERRIDES TOOL
   ════════════════════════════════════════════════════════════════════════════ */

const so = {
  saveWrapper: {padding:'10px 14px 8px',borderTop:'1px solid #e5e5e5'},
  nameRow:     {display:'flex',gap:6,alignItems:'center',marginBottom:8},
  input:       {flex:1,fontSize:11,padding:'4px 8px',border:'1px solid #e5e5e5',borderRadius:4,outline:'none',fontFamily:"'DM Sans',-apple-system,sans-serif",color:'#171717'},
  formatLabel: {fontSize:10,fontWeight:600,color:'#a3a3a3',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4},
  formatGrid:  {display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,marginBottom:8},
  formatBtn:   {fontSize:11,padding:'4px 8px',border:'1px solid #e5e5e5',borderRadius:4,cursor:'pointer',textAlign:'left',background:'#fff',color:'#525252',fontFamily:"'DM Sans',-apple-system,sans-serif"},
  formatBtnOn: {fontSize:11,padding:'4px 8px',border:'1px solid #bfdbfe',borderRadius:4,cursor:'pointer',textAlign:'left',background:'#eff6ff',color:'#2563EB',fontWeight:500,fontFamily:"'DM Sans',-apple-system,sans-serif"},
  actionRow:   {display:'flex',gap:6,alignItems:'center'},
  saveBtn:     {flex:1,fontSize:11,fontWeight:500,color:'#ffffff',background:'#2563EB',border:'none',cursor:'pointer',padding:'5px 10px',borderRadius:4},
  backBtn:     {fontSize:11,fontWeight:400,color:'#737373',background:'none',border:'1px solid #e5e5e5',cursor:'pointer',padding:'5px 8px',borderRadius:4},
  hint:        {fontSize:10,color:'#a3a3a3',marginTop:6,marginBottom:0},
  createBtn:   {display:'block',width:'100%',fontSize:11,fontWeight:500,color:'#2563EB',background:'#eff6ff',border:'1px solid #bfdbfe',cursor:'pointer',padding:'6px 10px',borderRadius:4,marginTop:8,textAlign:'center',fontFamily:"'DM Sans',-apple-system,sans-serif"},
};

function OverridesPopover({onHide}) {
  const [globals, updateGlobals] = useGlobals();
  const [saveMode, setSaveMode]     = useState(false);
  const [name, setName]             = useState('');
  const [selectedFormat, setSelectedFormat] = useState('css');
  const [saveStatus, setSaveStatus] = useState(null);

  const paletteOverrides     = PALETTE_KEYS.filter(k =>
    (globals[k] || DEFAULT_PALETTE[k]).toLowerCase() !== DEFAULT_PALETTE[k].toLowerCase());
  const currentTypescale     = globals.typescale     || DEFAULT_TYPESCALE;
  const currentTypescaleBase = globals.typescaleBase || DEFAULT_TYPESCALE_BASE;
  const currentDensity       = globals.density       || DEFAULT_DENSITY;
  const currentIconWeight    = globals.iconWeight    || DEFAULT_ICON_WEIGHT;
  const typescaleChanged     = parseFloat(currentTypescale)   !== parseFloat(DEFAULT_TYPESCALE)
                            || parseInt(currentTypescaleBase) !== parseInt(DEFAULT_TYPESCALE_BASE);
  const densityChanged       = parseFloat(currentDensity)     !== parseFloat(DEFAULT_DENSITY);
  const iconWeightChanged    = currentIconWeight !== DEFAULT_ICON_WEIGHT;
  const componentOverrides   = COMPONENT_GLOBAL_KEYS.filter(k => globals[k]);
  const total = paletteOverrides.length + (typescaleChanged?1:0) + (densityChanged?1:0) + (iconWeightChanged?1:0) + componentOverrides.length;

  function handleReset() {
    updateGlobals({
      ...Object.fromEntries(PALETTE_KEYS.map(k=>[k,DEFAULT_PALETTE[k]])),
      typescale:DEFAULT_TYPESCALE, typescaleBase:DEFAULT_TYPESCALE_BASE, density:DEFAULT_DENSITY, iconWeight:DEFAULT_ICON_WEIGHT,
      ...Object.fromEntries(COMPONENT_GLOBAL_KEYS.map(k=>[k,''])),
    });
    onHide();
  }

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;

    const currentConfig = snapshotGlobals(globals);
    const safeName = trimmed.toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');

    // Save to localStorage
    const existing = loadThemes();
    const updated  = [...existing, { id: Date.now().toString(), name: trimmed, config: currentConfig }];
    saveThemes(updated);

    setSaveStatus('saving');

    // Create app folder on disk
    try {
      const files = {
        'tao-theme.json':    generateJSON(currentConfig, safeName),
        'tao-overrides.css': generateCSS(currentConfig, safeName),
        'package.json': JSON.stringify({
          name: safeName, version:'0.1.0', private:true,
          scripts:{'build-tokens':'style-dictionary build --config tao-sd.config.json'},
        }, null, 2),
      };
      const res  = await fetch('/api/create-app', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name: safeName, files }),
      });
      const data = await res.json();

      if (data.success) {
        // Also download selected format immediately
        const fmt = FORMATS.find(f => f.id === selectedFormat);
        if (fmt) downloadFile(fmt.gen(currentConfig, safeName), `tao-${safeName}${fmt.ext}`, fmt.mime);
        setSaveStatus({ ok:true, msg:`Saved — ${data.path}` });
        setTimeout(() => { setSaveStatus(null); onHide(); }, 2000);
      } else {
        setSaveStatus({ ok:false, msg: data.error || 'Unknown error' });
      }
    } catch (err) {
      setSaveStatus({ ok:false, msg: err.message });
    }
  }

  const overridesContent = React.createElement(React.Fragment, null,
    paletteOverrides.length > 0 && React.createElement('div',{style:s.section},
      React.createElement(SectionHeader,{label:'Color palette'}),
      paletteOverrides.map(k => React.createElement('div',{key:k,style:s.row},
        React.createElement(Swatch,{color:DEFAULT_PALETTE[k]}),
        React.createElement('span',{style:s.arrow},'→'),
        React.createElement(Swatch,{color:globals[k]}),
        React.createElement('span',{style:s.rowLabel},PALETTE_LABELS[k]),
      )),
    ),
    typescaleChanged && React.createElement('div',{style:s.section},
      paletteOverrides.length > 0 && React.createElement(Divider),
      React.createElement(SectionHeader,{label:'Type scale'}),
      parseFloat(currentTypescale) !== parseFloat(DEFAULT_TYPESCALE) && React.createElement('div',{style:s.row},
        React.createElement('span',{style:s.rowLabel},'Ratio'),
        React.createElement('span',{style:s.badgeMuted},`${TYPESCALE_NAMES[DEFAULT_TYPESCALE]||DEFAULT_TYPESCALE} (${DEFAULT_TYPESCALE})`),
        React.createElement('span',{style:s.arrow},'→'),
        React.createElement('span',{style:s.badge},`${TYPESCALE_NAMES[currentTypescale]||currentTypescale} (${currentTypescale})`),
      ),
      parseInt(currentTypescaleBase) !== parseInt(DEFAULT_TYPESCALE_BASE) && React.createElement('div',{style:s.row},
        React.createElement('span',{style:s.rowLabel},'Base size'),
        React.createElement('span',{style:s.badgeMuted},`${DEFAULT_TYPESCALE_BASE}px`),
        React.createElement('span',{style:s.arrow},'→'),
        React.createElement('span',{style:s.badge},`${currentTypescaleBase}px`),
      ),
      React.createElement('div',{style:s.grid},
        generateTypeScale(parseFloat(currentTypescale),parseInt(currentTypescaleBase)).map(({key,value}) =>
          React.createElement('div',{key,style:s.gridRow},
            React.createElement('span',{style:s.gridKey},key),
            React.createElement('span',null,value),
          )),
      ),
    ),
    densityChanged && React.createElement('div',{style:s.section},
      (paletteOverrides.length > 0 || typescaleChanged) && React.createElement(Divider),
      React.createElement(SectionHeader,{label:'Spacing'}),
      React.createElement('div',{style:s.row},
        React.createElement('span',{style:s.rowLabel},'Density'),
        React.createElement('span',{style:s.badgeMuted},DENSITY_NAMES[DEFAULT_DENSITY]||DEFAULT_DENSITY),
        React.createElement('span',{style:s.arrow},'→'),
        React.createElement('span',{style:s.badge},DENSITY_NAMES[currentDensity]||currentDensity),
      ),
      React.createElement('div',{style:s.grid},
        generateSpacing(parseFloat(currentDensity)).map(({key,value}) =>
          React.createElement('div',{key,style:s.gridRow},
            React.createElement('span',{style:s.gridKey},key),
            React.createElement('span',null,value),
          )),
      ),
    ),
    iconWeightChanged && React.createElement('div',{style:s.section},
      (paletteOverrides.length > 0 || typescaleChanged || densityChanged) && React.createElement(Divider),
      React.createElement(SectionHeader,{label:'Icons'}),
      React.createElement('div',{style:s.row},
        React.createElement('span',{style:s.rowLabel},'Weight'),
        React.createElement('span',{style:s.badgeMuted},DEFAULT_ICON_WEIGHT),
        React.createElement('span',{style:s.arrow},'→'),
        React.createElement('span',{style:s.badge},currentIconWeight),
      ),
    ),
    componentOverrides.length > 0 && React.createElement('div',{style:s.section},
      React.createElement(Divider),
      React.createElement(SectionHeader,{label:'Components'}),
      ...componentOverrides.map(k => {
        const def = COMPONENT_TOKENS.find(t => t.globalKey === k);
        return React.createElement('div',{key:k,style:s.row},
          React.createElement('span',{style:{...s.rowLabel,fontFamily:'monospace',fontSize:10}}, def ? def.token : `--${k}`),
          React.createElement('span',{style:s.arrow},'→'),
          React.createElement('span',{style:s.badge}, globals[k]),
        );
      }),
    ),
  );

  if (total === 0) return React.createElement('div', {style:s.wrapper, onMouseDown:e=>e.stopPropagation()},
    React.createElement('div', {style:s.header}, React.createElement('span',{style:s.title},'Active overrides')),
    React.createElement('div', {style:s.empty}, 'No overrides — using defaults'),
    React.createElement('div',{style:{padding:'4px 14px 8px'}},
      React.createElement('button',{style:so.createBtn,onClick:()=>setSaveMode(true)},'Create new app…'),
    ),
  );

  return React.createElement('div', {style:s.wrapper, onMouseDown:e=>e.stopPropagation()},
    // ── Header
    React.createElement('div', {style:s.header},
      React.createElement('span',{style:s.title}, saveMode ? 'Create new app' : 'Active overrides'),
      !saveMode && React.createElement('button',{style:s.actionBtn,onClick:handleReset},'Reset all'),
    ),

    // ── Overrides summary
    overridesContent,

    // ── Save form (shown after "Create new app")
    saveMode
      ? React.createElement('div',{style:so.saveWrapper},
          React.createElement('div',{style:so.nameRow},
            React.createElement('input',{
              autoFocus:true, style:so.input, placeholder:'Name this app…',
              value:name, onChange:e=>setName(e.target.value),
              onKeyDown:e=>{ e.stopPropagation(); if(e.key==='Enter') handleSave(); if(e.key==='Escape') setSaveMode(false); },
            }),
          ),
          // ── Component tokens included in export
          React.createElement('div',{style:{...so.formatLabel,marginBottom:4,marginTop:2}},`Also exports — component tokens (${COMPONENT_TOKENS.length})`),
          React.createElement('div',{style:{background:'#f8faff',border:'1px solid #dbeafe',borderRadius:4,padding:'6px 8px',marginBottom:8}},
            ...(() => {
              const byComponent = COMPONENT_TOKENS.reduce((acc,t)=>{ (acc[t.component]=acc[t.component]||[]).push(t); return acc; },{});
              return Object.entries(byComponent).flatMap(([name,tokens])=>[
                React.createElement('div',{key:`ch-${name}`,style:{fontSize:10,fontWeight:600,color:'#1d4ed8',marginBottom:2}},name),
                ...tokens.map(t=>React.createElement('div',{key:t.token,style:{display:'flex',justifyContent:'space-between',fontSize:10,color:'#525252',padding:'1px 0'}},
                  React.createElement('span',{style:{fontFamily:'monospace'}},t.token),
                  React.createElement('span',{style:{color:'#93c5fd'}},t.fallback),
                )),
              ]);
            })(),
          ),
          React.createElement('div',{style:so.formatLabel},'Export format'),
          React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:4,marginBottom:8}},
            FORMATS.map(f => React.createElement('button',{
              key:f.id,
              style: selectedFormat===f.id ? so.formatBtnOn : so.formatBtn,
              onClick:()=>setSelectedFormat(f.id),
            },
              React.createElement('div',{style:{fontWeight: selectedFormat===f.id ? 500 : 400}}, f.label),
              React.createElement('div',{style:{fontSize:10,color: selectedFormat===f.id ? '#3b82f6' : '#a3a3a3',marginTop:1,fontWeight:400}}, f.desc),
            )),
          ),
          React.createElement('div',{style:so.actionRow},
            React.createElement('button',{style:so.backBtn,onClick:()=>setSaveMode(false)},'Back'),
            React.createElement('button',{style:so.saveBtn,onClick:handleSave, disabled:!name.trim()},'Save'),
          ),
          saveStatus === 'saving' && React.createElement('p',{style:{...so.hint,color:'#737373'}},'Creating…'),
          saveStatus && saveStatus.ok  && React.createElement('p',{style:{...so.hint,color:'#16a34a'}},`✓ ${saveStatus.msg}`),
          saveStatus && !saveStatus.ok && React.createElement('p',{style:{...so.hint,color:'#dc2626'}},`✗ ${saveStatus.msg}`),
        )
      : React.createElement('div',{style:{padding:'4px 14px 8px'}},
          React.createElement('button',{style:so.createBtn,onClick:()=>setSaveMode(true)},'Create new app…'),
        ),
  );
}

function OverridesTool() {
  const [globals] = useGlobals();
  const paletteCount       = PALETTE_KEYS.filter(k=>(globals[k]||DEFAULT_PALETTE[k]).toLowerCase()!==DEFAULT_PALETTE[k].toLowerCase()).length;
  const typescaleActive    = parseFloat(globals.typescale||DEFAULT_TYPESCALE)!==parseFloat(DEFAULT_TYPESCALE)
                          || parseInt(globals.typescaleBase||DEFAULT_TYPESCALE_BASE)!==parseInt(DEFAULT_TYPESCALE_BASE);
  const densityActive      = parseFloat(globals.density||DEFAULT_DENSITY)!==parseFloat(DEFAULT_DENSITY);
  const iconWeightActive   = (globals.iconWeight||DEFAULT_ICON_WEIGHT) !== DEFAULT_ICON_WEIGHT;
  const componentActive = COMPONENT_GLOBAL_KEYS.filter(k => globals[k]).length;
  const total = paletteCount + (typescaleActive?1:0) + (densityActive?1:0) + (iconWeightActive?1:0) + componentActive;
  const has   = total > 0;

  return React.createElement(WithTooltip,
    {placement:'bottom',trigger:'click',closeOnOutsideClick:true,
     tooltip:({onHide})=>React.createElement(OverridesPopover,{onHide})},
    React.createElement(IconButton,
      {active:has,title:'Theme overrides',
       style:{fontSize:11,fontWeight:has?600:400,color:has?'#2563EB':undefined}},
      has ? `Overrides\u00A0(${total})` : 'Overrides',
    ),
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   THEMES TOOL
   ════════════════════════════════════════════════════════════════════════════ */

const ts = {
  wrapper:    {fontFamily:"'DM Sans',-apple-system,sans-serif",width:280,padding:'10px 0 8px'},
  header:     {display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 14px 10px',borderBottom:'1px solid #e5e5e5'},
  title:      {fontSize:12,fontWeight:600,color:'#171717',margin:0},
  themeRow:   {display:'flex',alignItems:'center',gap:6,padding:'5px 10px 5px 14px',cursor:'pointer',borderRadius:0},
  themeRowActive:{background:'#eff6ff'},
  themeName:  {flex:1,fontSize:12,color:'#171717',fontWeight:400},
  themeNameActive:{color:'#2563EB',fontWeight:500},
  swatches:   {display:'flex',gap:2},
  iconBtn:    {background:'none',border:'none',cursor:'pointer',padding:'2px 4px',borderRadius:3,fontSize:11,color:'#a3a3a3',lineHeight:1},
  divider:    {borderTop:'1px solid #e5e5e5',margin:'6px 0'},
  saveArea:   {padding:'6px 14px 4px'},
  saveRow:    {display:'flex',gap:6,alignItems:'center'},
  input:      {flex:1,fontSize:11,padding:'4px 8px',border:'1px solid #e5e5e5',borderRadius:4,outline:'none',fontFamily:"'DM Sans',-apple-system,sans-serif",color:'#171717'},
  saveBtn:    {fontSize:11,fontWeight:500,color:'#ffffff',background:'#2563EB',border:'none',cursor:'pointer',padding:'4px 10px',borderRadius:4,whiteSpace:'nowrap'},
  exportBtn:  {fontSize:11,fontWeight:400,color:'#525252',background:'none',border:'1px solid #e5e5e5',cursor:'pointer',padding:'3px 8px',borderRadius:4,width:'100%',textAlign:'left',marginTop:6},
  hint:       {fontSize:10,color:'#a3a3a3',marginTop:4},
};

function PaletteDots({palette}) {
  const keys = ['palette-1','palette-2','palette-3','palette-4','palette-5'];
  return React.createElement('div',{style:ts.swatches},
    keys.map(k => React.createElement('span',{key:k,style:{
      width:8,height:8,borderRadius:'50%',background:palette[k]||DEFAULT_PALETTE[k],
      border:'1px solid rgba(0,0,0,0.1)',flexShrink:0,
    }})),
  );
}

const FORMATS = [
  {
    id:    'css',
    label: 'CSS variables',
    ext:   '.css',
    desc:  'Import after tokens.css — works in any web app instantly',
    mime:  'text/css',
    gen:   (config, name) => generateCSS(config, name),
  },
  {
    id:    'json',
    label: 'Design tokens JSON',
    ext:   '.json',
    desc:  'Feed to Style Dictionary to build iOS, Android, or any other platform',
    mime:  'application/json',
    gen:   (config, name) => generateJSON(config, name),
  },
  {
    id:    'js',
    label: 'JS module',
    ext:   '.js',
    desc:  'ES module export — for React Native, Electron, or Node.js',
    mime:  'text/javascript',
    gen:   (config, name) => generateJSModule(config, name),
  },
  {
    id:    'sd',
    label: 'Style Dictionary config',
    ext:   '-sd.config.json',
    desc:  'Scaffold config for iOS + Android + CSS builds in one step',
    mime:  'application/json',
    gen:   (config, name) => generateSDConfig(name),
  },
];

function ExportPanel({ config, appName, onClose }) {
  return React.createElement('div', {style:{background:'#f8faff',border:'1px solid #dbeafe',borderRadius:6,margin:'6px 14px 2px',padding:'10px 12px'}},
    React.createElement('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}},
      React.createElement('span',{style:{fontSize:11,fontWeight:600,color:'#1d4ed8'}},'Export formats'),
      React.createElement('button',{style:{background:'none',border:'none',cursor:'pointer',fontSize:12,color:'#a3a3a3',padding:0},onClick:onClose},'✕'),
    ),
    FORMATS.map(f =>
      React.createElement('div',{key:f.id,style:{display:'flex',alignItems:'flex-start',gap:8,marginBottom:8}},
        React.createElement('div',{style:{flex:1}},
          React.createElement('div',{style:{fontSize:11,fontWeight:500,color:'#171717'}},f.label),
          React.createElement('div',{style:{fontSize:10,color:'#737373',marginTop:1}},f.desc),
        ),
        React.createElement('button',{
          style:{fontSize:10,fontWeight:500,color:'#2563EB',background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:4,cursor:'pointer',padding:'3px 8px',whiteSpace:'nowrap',flexShrink:0},
          onClick: () => downloadFile(f.gen(config, appName), `tao-${appName || 'theme'}${f.ext}`, f.mime),
        }, `↓ ${f.ext}`),
      ),
    ),
    React.createElement('div',{style:{fontSize:10,color:'#93c5fd',borderTop:'1px solid #dbeafe',paddingTop:6,marginTop:4}},
      'Files go in: apps/',React.createElement('strong',null,appName||'my-app'),'/',
    ),
  );
}

function ThemesPopover({onHide}) {
  const [globals, updateGlobals] = useGlobals();
  const [themes, setThemes]          = useState(() => loadThemes());
  const [exportingId, setExportingId] = useState(null);
  const [updatingId,  setUpdatingId]  = useState(null); // theme being saved to disk
  const [updateOkId,  setUpdateOkId]  = useState(null); // theme that just saved OK

  const currentConfig = snapshotGlobals(globals);

  const activeId = themes.find(t =>
    JSON.stringify(t.config) === JSON.stringify(currentConfig)
  )?.id || null;

  const isDefault = PALETTE_KEYS.every(k => currentConfig.palette[k] === DEFAULT_PALETTE[k])
    && currentConfig.typescale     === DEFAULT_TYPESCALE
    && currentConfig.typescaleBase === DEFAULT_TYPESCALE_BASE
    && currentConfig.density       === DEFAULT_DENSITY
    && currentConfig.iconWeight    === DEFAULT_ICON_WEIGHT;

  function handleDelete(id, e) {
    e.stopPropagation();
    const updated = themes.filter(t => t.id !== id);
    setThemes(updated);
    saveThemes(updated);
    if (exportingId === id) setExportingId(null);
    if (updatingId  === id) setUpdatingId(null);
    if (updateOkId  === id) setUpdateOkId(null);
  }

  function toggleExport(id, e) {
    e.stopPropagation();
    setExportingId(prev => prev === id ? null : id);
  }

  async function handleUpdate(id, e) {
    e.stopPropagation();
    if (updatingId === id) return;
    const t = themes.find(th => th.id === id);
    if (!t) return;

    const newConfig = snapshotGlobals(globals);
    const safeName  = t.name.toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');

    // Persist to localStorage immediately so switching themes reflects the update
    const updated = themes.map(th => th.id === id ? { ...th, config: newConfig } : th);
    setThemes(updated);
    saveThemes(updated);

    setUpdatingId(id);
    try {
      const files = {
        'tao-theme.json':    generateJSON(newConfig, safeName),
        'tao-overrides.css': generateCSS(newConfig, safeName),
        'package.json': JSON.stringify({
          name: safeName, version:'0.1.0', private:true,
          scripts:{'build-tokens':'style-dictionary build --config tao-sd.config.json'},
        }, null, 2),
      };
      const res  = await fetch('/api/create-app', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name: safeName, files }),
      });
      const data = await res.json();
      setUpdatingId(null);
      if (data.success) {
        setUpdateOkId(id);
        setTimeout(() => setUpdateOkId(prev => prev === id ? null : prev), 1800);
      }
    } catch {
      setUpdatingId(null);
    }
  }

  return React.createElement('div',{style:ts.wrapper, onMouseDown:e=>e.stopPropagation()},
    React.createElement('div',{style:ts.header},
      React.createElement('span',{style:ts.title},'Saved themes'),
    ),

    // ── Tao Default
    React.createElement('div',{
      style:{...ts.themeRow,...(isDefault?ts.themeRowActive:{})},
      onClick:()=>applyConfig({palette:DEFAULT_PALETTE,typescale:DEFAULT_TYPESCALE,typescaleBase:DEFAULT_TYPESCALE_BASE,density:DEFAULT_DENSITY,iconWeight:DEFAULT_ICON_WEIGHT},updateGlobals),
    },
      React.createElement('span',{style:{...ts.themeName,...(isDefault?ts.themeNameActive:{}),fontStyle:'italic'}},'Tao Default'),
      React.createElement(PaletteDots,{palette:DEFAULT_PALETTE}),
    ),

    // ── Saved themes
    themes.length > 0 && React.createElement('div',{style:{borderTop:'1px solid #e5e5e5',marginTop:2}},
      themes.map(t => React.createElement(React.Fragment,{key:t.id},
        React.createElement('div',{
          style:{...ts.themeRow,...(t.id===activeId?ts.themeRowActive:{})},
          onClick:()=>applyConfig(t.config,updateGlobals),
        },
          React.createElement('span',{style:{...ts.themeName,...(t.id===activeId?ts.themeNameActive:{})}},t.name),
          React.createElement(PaletteDots,{palette:t.config.palette}),
          // ── Update button
          React.createElement('button',{
            style:{
              ...ts.iconBtn,
              color: updatingId===t.id ? '#a3a3a3' : updateOkId===t.id ? '#16a34a' : '#a3a3a3',
              opacity: updatingId===t.id ? 0.5 : 1,
            },
            title: 'Update with current Storybook state',
            disabled: updatingId===t.id,
            onClick:(e)=>handleUpdate(t.id,e),
          }, updatingId===t.id ? '…' : updateOkId===t.id ? '✓' : '↑'),
          // ── Export button
          React.createElement('button',{style:{...ts.iconBtn,color:exportingId===t.id?'#2563EB':'#a3a3a3'},title:'Export',onClick:(e)=>toggleExport(t.id,e)},'↓'),
          // ── Delete button
          React.createElement('button',{style:{...ts.iconBtn,color:'#f87171'},title:'Delete',onClick:(e)=>handleDelete(t.id,e)},'×'),
        ),
        exportingId === t.id && React.createElement(ExportPanel,{config:t.config,appName:t.name.toLowerCase().replace(/\s+/g,'-'),onClose:()=>setExportingId(null)}),
      )),
    ),

  );
}

function ThemesTool() {
  const [themes] = useState(() => loadThemes());

  return React.createElement(WithTooltip,
    {placement:'bottom',trigger:'click',closeOnOutsideClick:true,
     tooltip:({onHide})=>React.createElement(ThemesPopover,{onHide})},
    React.createElement(IconButton,
      {title:'Saved themes',style:{fontSize:11}},
      'Themes',
    ),
  );
}

/* ─── Register both tools ───────────────────────────────────────────────────── */

addons.register('tao/overrides', () => {
  addons.add('tao/overrides/tool', {
    type:'tool', title:'Overrides', match:({tabId})=>!tabId,
    render:()=>React.createElement(OverridesTool,null),
  });
});

addons.register('tao/themes', () => {
  addons.add('tao/themes/tool', {
    type:'tool', title:'Themes', match:({tabId})=>!tabId,
    render:()=>React.createElement(ThemesTool,null),
  });
});
