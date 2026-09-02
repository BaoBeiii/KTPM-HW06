#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script đóng gói nộp bài chuẩn quy chế Mục 14 đề bài HW06
Tác giả: Lưu Ngô Quốc Bảo (MSSV: 23127327)
Tên tệp nén đầu ra: 23127327_HW06_AI_API_100.zip
"""

import os
import zipfile

def make_submission_zip():
    student_id = "23127327"
    self_grade = "100"
    zip_name = f"{student_id}_HW06_AI_API_{self_grade}.zip"
    
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    zip_path = os.path.join(root_dir, zip_name)
    
    # Danh sách các tệp và thư mục loại trừ
    excluded_dirs = {'.git', 'node_modules', '__pycache__', '.vscode', '.idea'}
    excluded_extensions = {'.zip', '.tmp'}
    excluded_files = {'package-lock.json'}

    print(f"[Packaging] Creating submission package: {zip_name}...")
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            # Lọc bỏ thư mục không cần thiết
            dirs[:] = [d for d in dirs if d not in excluded_dirs]
            
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in excluded_extensions or file in excluded_files:
                    continue
                if file == zip_name:
                    continue
                
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, root_dir)
                zipf.write(full_path, rel_path)
                
    zip_size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"[Success] Created: {zip_name} ({zip_size_mb:.2f} MB)")
    print(f"[Done] Package ready: {zip_name}")


if __name__ == '__main__':
    make_submission_zip()
