import os

def delete_ts_tsx_files(parent_dir):
    for root, dirs, files in os.walk(parent_dir, topdown=True):
        # Skip node_modules directories
        dirs[:] = [d for d in dirs if d != 'node_modules']
        
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                file_path = os.path.join(root, file)
                try:
                    os.remove(file_path)
                    print(f"Deleted: {file_path}")
                except Exception as e:
                    print(f"Failed to delete {file_path}: {e}")

if __name__ == "__main__":
    # Replace this with your actual parent directory path
    parent_folder = input("Enter the path to the parent directory: ").strip()
    if os.path.isdir(parent_folder):
        delete_ts_tsx_files(parent_folder)
    else:
        print("Invalid directory path.")
