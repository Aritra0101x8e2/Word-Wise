
import React, { useState } from 'react';
import Autocomplete from '@/components/Autocomplete';
import DictionaryManager from '@/components/DictionaryManager';

const Index = () => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleSelect = (word: string) => {
    setSelectedWord(word);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-16 px-4 bg-jet-dark">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center text-white"></h1>
        <p className="text-slate-400 mb-8 text-center">
          Start searching to see suggestions from our dictionary
        </p>

        <div className="mb-8">
          <Autocomplete 
            placeholder="Search for words..." 
            maxSuggestions={6}
            onSelect={handleSelect}
          />
        </div>

        {selectedWord && (
          <div className="p-4 rounded-lg border border-jet-light bg-jet mb-8 animate-fade-in text-center">
            <p className="text-slate-400 mb-1">You selected:</p>
            <p className="text-xl font-medium text-white">{selectedWord}</p>
          </div>
        )}

        <div className="mb-8">
          <DictionaryManager />
        </div>

        {/* <div className="p-4 rounded-lg border border-jet-light bg-jet">
          <h2 className="text-xl font-semibold mb-4">About This Demo</h2>
          <p className="text-slate-400 mb-2">
            This autocomplete feature demonstrates:
          </p>
          <ul className="list-disc list-inside text-slate-400 space-y-1">
            <li>Trie data structure for efficient prefix-based word searching</li>
            <li>Fast word lookup with O(m) time complexity (where m is prefix length)</li>
            <li>Keyboard navigation support (arrows, enter, escape)</li>
            <li>Ability to add custom words to the dictionary</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default Index;
