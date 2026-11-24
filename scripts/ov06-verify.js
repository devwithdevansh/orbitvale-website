/* OV/06 source-level regression check. Build verification remains npm run build. */
const fs=require('fs'),path=require('path');
const ts=require('typescript');
const root=path.join(__dirname,'..');
let errors=[];let count=0;
const walk=(folder)=>{for(const d of fs.readdirSync(folder,{withFileTypes:true})){const full=path.join(folder,d.name);if(d.isDirectory())walk(full);else if(/\.(ts|tsx)$/.test(d.name)){count++;const input=fs.readFileSync(full,'utf8');const result=ts.transpileModule(input,{fileName:full,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}});for(const e of (result.diagnostics||[])){if(e.category===ts.DiagnosticCategory.Error)errors.push(`${full}: ${ts.flattenDiagnosticMessageText(e.messageText,' ')}`)}}}};
walk(path.join(root,'src'));
const style=fs.readFileSync(path.join(root,'src/components/school-orbit/schoolOrbitStyles.ts'),'utf8');
if(!style.includes('schoolOrbitHeaderOverrides')) errors.push('School Orbit CSS export regression');
const live=fs.readFileSync(path.join(root,'src/lib/liveExperiences.ts'),'utf8');
for(const name of ['forge-gym','school-erp','automotive','saltlight','amber-ash','nuance','invoice-manager']) if(!live.includes(`'${name}'`))errors.push(`Missing live preview: ${name}`);
console.log(`OV06 source syntax: ${count} TS/TSX files, ${errors.length} errors`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
