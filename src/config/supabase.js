import { createClient } from '@supabase/supabase-js';

// Ganti nilai ini dengan Project URL dan anon public key dari Supabase Dashboard Anda
const supabaseUrl = 'https://irqdgjldkzfzjzyyirzm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlycWRnamxka3pmemp6eXlpcnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4Mzc4NjcsImV4cCI6MjEwMTQxMzg2N30.6jpF_1eyW-J5rYmX1qYgPGs74TiqOnRDDvHaxwKoznc';

export const supabase = createClient(supabaseUrl, supabaseKey);