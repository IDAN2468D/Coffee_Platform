with open('components/Header.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines, 1):
    # simple token count for <button and </button
    opens = line.count('<button')
    closes = line.count('</button>')
    for _ in range(opens):
        stack.append(i)
    for _ in range(closes):
        if stack:
            stack.pop()
        else:
            print(f"Extra </button> on line {i}")

print("Unclosed <button> started on lines:", stack)
