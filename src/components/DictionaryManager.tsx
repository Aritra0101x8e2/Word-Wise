
import React, { useState } from 'react';
import dictionaryService from '../services/DictionaryService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const DictionaryManager: React.FC = () => {
  const [newWord, setNewWord] = useState('');
  const [bulkWords, setBulkWords] = useState('');

  const handleAddWord = () => {
    if (!newWord.trim()) {
      toast({
        title: "Error",
        description: "Please enter a word.",
        variant: "destructive",
      });
      return;
    }

    dictionaryService.addWord(newWord.trim());
    toast({
      title: "Success",
      description: `Added "${newWord}" to dictionary.`,
    });
    setNewWord('');
  };

  const handleBulkAdd = () => {
    if (!bulkWords.trim()) {
      toast({
        title: "Error",
        description: "Please enter words.",
        variant: "destructive",
      });
      return;
    }

    const words = bulkWords
      .split(/[,\n]/)
      .map(word => word.trim())
      .filter(word => word.length > 0);

    dictionaryService.addWords(words);
    toast({
      title: "Success",
      description: `Added ${words.length} words to dictionary.`,
    });
    setBulkWords('');
  };

  return (
    <div className="rounded-lg p-4 border border-jet-light bg-jet">
      <h2 className="text-xl font-semibold mb-4">WordWise - Word Suggestor </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Add a Single Word</h3>
          <div className="flex gap-2">
            <Input
              className="bg-jet-dark border-jet-light text-white"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Enter a word"
            />
          <Button 
  onClick={handleAddWord}
  className="bg-white text-black hover:bg-black hover:text-white"
>
  Add
</Button>


          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Add Multiple Words</h3>
          <textarea
            className="w-full h-24 px-3 py-2 bg-jet-dark border border-jet-light rounded-md text-white resize-none focus:outline-none focus:ring-1 focus:ring-slate-400"
            value={bulkWords}
            onChange={(e) => setBulkWords(e.target.value)}
            placeholder="Enter words separated by commas or new lines"
          />
         <Button 
  onClick={handleBulkAdd}
  className="mt-2 bg-white text-black hover:bg-black hover:text-white w-full"
>
  Add All Words
</Button>

        </div>
      </div>
    </div>
  );
};

export default DictionaryManager;
