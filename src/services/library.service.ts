import { Injectable, signal, computed } from '@angular/core';
import { Book, BorrowRecord } from '../models/types';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  // Initialize with real books, covers, and preview text
  private initialBooks: Book[] = [
    {
      id: 'hp1', 
      title: 'Harry Potter and the Sorcerer\'s Stone', 
      author: 'J.K. Rowling', 
      isbn: '9780590353427',
      description: 'Harry Potter has never been the star of a Quidditch team, scoring points while riding a broom far above the ground. He knows no spells, has never helped to hatch a dragon, and has never worn a cloak of invisibility. All he knows is a miserable life with the Dursleys...',
      category: 'Fantasy', 
      publicationYear: 1997, 
      copiesTotal: 15, 
      copiesAvailable: 14, 
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg',
      previewPages: [
        "CHAPTER ONE\n\nTHE BOY WHO LIVED\n\nMr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. They were the last people you'd expect to be involved in anything strange or mysterious, because they just didn't hold with such nonsense.",
        "Mr. Dursley was the director of a firm called Grunnings, which made drills. He was a big, beefy man with hardly any neck, although he did have a very large mustache. Mrs. Dursley was thin and blonde and had nearly twice the usual amount of neck, which came in very useful as she spent so much of her time craning over garden fences, spying on the neighbors.",
        "The Dursleys had a small son called Dudley and in their opinion there was no finer boy anywhere."
      ]
    },
    {
      id: 'gs1', 
      title: 'Geronimo Stilton: Lost Treasure of the Emerald Eye', 
      author: 'Geronimo Stilton', 
      isbn: '9780439559638',
      description: 'It all started when my sister, Thea, discovered an old map. It showed a secret treasure on a faraway island. And before I could let out a squeak of protest, Thea dragged me into her treasure hunt!',
      category: 'Children', 
      publicationYear: 2004, 
      copiesTotal: 10, 
      copiesAvailable: 10, 
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9780439559638-L.jpg',
      previewPages: [
        "LATE AGAIN!\n\nIt was a typical Monday morning. I was running late for work. Again.",
        "My name is Stilton, Geronimo Stilton. I am the publisher of The Rodent's Gazette, the most famouse newspaper on Mouse Island.",
        "I rushed into my office, panting. My sister Thea was already there, holding a dusty old piece of parchment. 'Geronimo!' she squeaked."
      ]
    },
    {
      id: 'pk1', 
      title: 'Pokémon: Essential Handbook', 
      author: 'Cris Silvestri', 
      isbn: '9780545427715',
      description: 'It\'s everything you ever wanted to know about every Pokémon — all in one place! This revised and updated edition of the 2008 bestseller has stats and facts kids need to know about all 646 Pokémon.',
      category: 'Reference', 
      publicationYear: 2012, 
      copiesTotal: 5, 
      copiesAvailable: 2, 
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9780545427715-L.jpg',
      previewPages: [
        "WELCOME TO THE WORLD OF POKÉMON!\n\nInside this book, you'll find stats and facts on over 640 Pokémon.",
        "BULBASAUR\nType: Grass/Poison\nDescription: A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
        "CHARMANDER\nType: Fire\nDescription: Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail."
      ]
    },
    {
      id: 'fj1', 
      title: 'Percy Jackson and the Lightning Thief', 
      author: 'Rick Riordan', 
      isbn: '9780786838653',
      description: 'Percy Jackson is a good kid, but he can\'t seem to focus on his schoolwork or control his temper. And lately, being away at boarding school is only getting worse...',
      category: 'Fantasy', 
      publicationYear: 2005, 
      copiesTotal: 8, 
      copiesAvailable: 0, 
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9780786838653-L.jpg',
      previewPages: [
        "I ACCIDENTALLY VAPORIZE MY PRE-ALGEBRA TEACHER\n\nLook, I didn't want to be a half-blood.",
        "If you're reading this because you think you might be one, my advice is: close this book right now. Believe whatever lie your mom or dad told you about your birth, and try to lead a normal life.",
        "Being a half-blood is dangerous. It's scary. Most of the time, it gets you killed in painful, nasty ways."
      ]
    }
  ];

  books = signal<Book[]>(this.initialBooks);
  borrowRecords = signal<BorrowRecord[]>([]);
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('All');

  categories = computed(() => {
    const cats = new Set(this.books().map(b => b.category));
    return ['All', ...Array.from(cats)].sort();
  });

  filteredBooks = computed(() => {
    let result = this.books();
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();

    if (query) {
      result = result.filter(b => 
        b.title.toLowerCase().includes(query) || 
        b.author.toLowerCase().includes(query) ||
        b.isbn.includes(query)
      );
    }

    if (category !== 'All') {
      result = result.filter(b => b.category === category);
    }

    return result;
  });

  getBookById(id: string): Book | undefined {
    return this.books().find(b => b.id === id);
  }

  borrowBook(userId: string, bookId: string) {
    const book = this.getBookById(bookId);
    if (book && book.copiesAvailable > 0) {
      this.books.update(books => 
        books.map(b => b.id === bookId ? { ...b, copiesAvailable: b.copiesAvailable - 1 } : b)
      );
      
      const now = new Date();
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + 14); // 14 days borrow period
      
      const newRecord: BorrowRecord = {
        id: 'rec_' + Math.random().toString(36).substring(2, 9),
        bookId,
        userId,
        borrowDate: now.toISOString(),
        dueDate: dueDate.toISOString(),
        returnDate: null,
        status: 'active',
        fineAmount: 0
      };
      
      this.borrowRecords.update(records => [...records, newRecord]);
    }
  }

  returnBook(recordId: string) {
    this.borrowRecords.update(records => {
      return records.map(record => {
        if (record.id === recordId && record.status !== 'returned') {
          // Increase available copies
          this.books.update(books => 
            books.map(b => b.id === record.bookId ? { ...b, copiesAvailable: b.copiesAvailable + 1 } : b)
          );
          
          return {
            ...record,
            status: 'returned',
            returnDate: new Date().toISOString()
          };
        }
        return record;
      });
    });
  }

  getRecordsForUser(userId: string) {
    return computed(() => {
      return this.borrowRecords()
        .filter(r => r.userId === userId)
        .map(r => ({
          ...r,
          book: this.getBookById(r.bookId)
        }));
    });
  }

  getAllActiveRecords() {
    return computed(() => {
      return this.borrowRecords()
        .filter(r => r.status !== 'returned')
        .map(r => ({
          ...r,
          book: this.getBookById(r.bookId)
        }));
    });
  }

  stats = computed(() => {
    const bks = this.books();
    const records = this.borrowRecords();
    
    return {
      totalBooks: bks.length,
      totalCopies: bks.reduce((sum, b) => sum + b.copiesTotal, 0),
      currentlyBorrowed: records.filter(r => r.status !== 'returned').length,
      overdueCount: records.filter(r => r.status === 'overdue').length
    };
  });
}