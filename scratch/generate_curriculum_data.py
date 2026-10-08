import zipfile
import xml.etree.ElementTree as ET
import re
import json

def extract_paras(docx_path):
    with zipfile.ZipFile(docx_path) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        paras = []
        for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            t = ''.join(el.text for el in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if el.text).strip()
            if t:
                paras.append(t)
    return paras

def parse_cyber(paras):
    levels = []
    curr_level = None
    curr_module = None
    
    for p in paras:
        lvl_m = re.match(r'^(Level\s*\d+)', p, re.IGNORECASE)
        if lvl_m:
            num = re.search(r'\d+', lvl_m.group(1)).group(0)
            curr_level = {
                "id": "cyber_lvl" + num,
                "title": p,
                "shortTitle": f"Level {num}",
                "modules": []
            }
            levels.append(curr_level)
            curr_module = None
            continue
            
        if curr_level is None:
            continue
            
        mod_m = re.match(r'^(\d+\.|\bPratique\b|\bProjets\b)\s*(.+)', p)
        if mod_m:
            curr_module = {
                "id": f"{curr_level['id']}_m{len(curr_level['modules'])+1}",
                "title": p,
                "items": []
            }
            curr_level["modules"].append(curr_module)
            continue
            
        if curr_module is not None:
            item_text = p
            checked = 'done' in item_text.lower()
            curr_module["items"].append({
                "id": f"{curr_module['id']}_i{len(curr_module['items'])+1}",
                "text": item_text,
                "checked": checked,
                "details": []
            })
            
    return {
        "id": "cyber",
        "title": "Cybersécurité & Systèmes",
        "subtitle": "Roadmap complète — Fondamentaux, Réseaux, SysAdmin, Cloud & Ethical Hacking",
        "icon": "shield-check",
        "tag": "CYBER",
        "category": "cyber",
        "color": "#06b6d4",
        "levels": levels
    }

def parse_language_doc(paras, track_id, track_title, track_subtitle, icon, color):
    levels = []
    curr_level = None
    curr_module = None
    curr_item = None
    
    for p in paras:
        lvl_m = re.search(r'Niveau\s*([A-C][1-2])', p, re.IGNORECASE)
        if (p.startswith('Programme complet') or p.startswith('Vollständiger Lernplan')) and lvl_m:
            lvl_code = lvl_m.group(1).upper()
            curr_level = {
                "id": f"{track_id}_{lvl_code.lower()}",
                "title": p,
                "shortTitle": f"Niveau {lvl_code}",
                "code": lvl_code,
                "modules": []
            }
            levels.append(curr_level)
            curr_module = None
            curr_item = None
            continue
            
        if curr_level is None:
            continue
            
        mod_m = re.match(r'^(\d+)\.\s+(.+)', p)
        if mod_m:
            curr_module = {
                "id": f"{curr_level['id']}_m{mod_m.group(1)}",
                "title": p,
                "items": []
            }
            curr_level["modules"].append(curr_module)
            curr_item = None
            continue
            
        if curr_module is None:
            continue
            
        chk_m = re.match(r'^\[([ xX]*)\]\s*(.*)', p)
        if chk_m:
            raw_text = chk_m.group(2).strip()
            is_done = bool(chk_m.group(1).strip() or re.search(r'\bdone\b', raw_text, re.IGNORECASE))
            cleaned_text = re.sub(r'\s*\bdone\b\s*', '', raw_text, flags=re.IGNORECASE).strip()
            if not cleaned_text:
                cleaned_text = p
                
            curr_item = {
                "id": f"{curr_module['id']}_i{len(curr_module['items'])+1}",
                "text": cleaned_text,
                "checked": is_done,
                "details": []
            }
            curr_module["items"].append(curr_item)
            continue
            
        if curr_item is not None:
            if len(curr_item["details"]) < 12:
                curr_item["details"].append(p)
            elif len(curr_item["details"]) == 12:
                curr_item["details"].append("...")
        else:
            curr_item = {
                "id": f"{curr_module['id']}_i{len(curr_module['items'])+1}",
                "text": p,
                "checked": False,
                "details": [],
                "isHeading": True
            }
            curr_module["items"].append(curr_item)

    return {
        "id": track_id,
        "title": track_title,
        "subtitle": track_subtitle,
        "icon": icon,
        "tag": track_id.upper(),
        "category": "lang",
        "color": color,
        "levels": levels
    }

print("Extracting docx files...")
cyber_paras = extract_paras('cyber.docx')
fr_paras = extract_paras('Programme complet de français.docx')
de_paras = extract_paras('Vollständiger Lernplan Deutsch.docx')

cyber_data = parse_cyber(cyber_paras)
fr_data = parse_language_doc(fr_paras, 'french', 'Français', 'Programme complet — A2, B1, B2, C1 (DALF)', 'book-open', '#3b82f6')
de_data = parse_language_doc(de_paras, 'german', 'Deutsch', 'Vollständiger Lernplan — B1, B2, C1 (Goethe)', 'languages', '#eab308')

data = {
    "version": 1,
    "lastUpdated": "2026-09-28",
    "tracks": {
        "cyber": cyber_data,
        "french": fr_data,
        "german": de_data
    }
}

out_js_path = 'assets/curriculum-data.js'
with open(out_js_path, 'w', encoding='utf-8') as f:
    f.write('// Autogenerated curriculum database from DOCX source files\n')
    f.write('window.CURRICULUM_DATA = ')
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print(f"Successfully generated {out_js_path}!")
