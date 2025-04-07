
/**
 * Trie data structure for efficient prefix-based word searching
 */
class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map<string, TrieNode>();
    this.isEndOfWord = false;
  }
}

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Inserts a word into the trie
   * @param word - The word to insert
   */
  insert(word: string): void {
    let current = this.root;
    
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }
    
    current.isEndOfWord = true;
  }

  /**
   * Inserts multiple words into the trie
   * @param words - Array of words to insert
   */
  insertMany(words: string[]): void {
    for (const word of words) {
      this.insert(word);
    }
  }

  /**
   * Checks if a word exists in the trie
   * @param word - The word to check
   * @returns True if the word exists, false otherwise
   */
  search(word: string): boolean {
    const node = this.findNode(word);
    return !!node && node.isEndOfWord;
  }

  /**
   * Checks if any word in the trie starts with the given prefix
   * @param prefix - The prefix to check
   * @returns True if a word with the prefix exists, false otherwise
   */
  startsWith(prefix: string): boolean {
    return !!this.findNode(prefix);
  }

  /**
   * Finds all words in the trie that start with the given prefix
   * @param prefix - The prefix to search for
   * @param limit - Maximum number of results to return
   * @returns Array of words with the given prefix
   */
  findWordsWithPrefix(prefix: string, limit: number = 10): string[] {
    const result: string[] = [];
    const node = this.findNode(prefix);
    
    if (!node) return result;
    
    this.dfs(node, prefix, result, limit);
    return result;
  }

  /**
   * Helper method to find a node in the trie
   * @param prefix - The prefix to find
   * @returns The node at the end of the prefix or undefined
   */
  private findNode(prefix: string): TrieNode | undefined {
    let current = this.root;
    
    for (const char of prefix) {
      if (!current.children.has(char)) {
        return undefined;
      }
      current = current.children.get(char)!;
    }
    
    return current;
  }

  /**
   * Depth-first search to find all words with a given prefix
   * @param node - Current node in the trie
   * @param prefix - Current prefix
   * @param result - Array to store results
   * @param limit - Maximum number of results
   */
  private dfs(node: TrieNode, prefix: string, result: string[], limit: number): void {
    if (result.length >= limit) return;
    
    if (node.isEndOfWord) {
      result.push(prefix);
    }
    
    for (const [char, childNode] of node.children.entries()) {
      this.dfs(childNode, prefix + char, result, limit);
    }
  }
}
