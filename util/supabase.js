
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://xvtjrpfucskcxobehmvy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dGpycGZ1Y3NrY3hvYmVobXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNDcwNTQsImV4cCI6MjAzMDgyMzA1NH0.Sf115dkRn7d2G8fJ3tta2WhBFSWMZrVSyr0tijTXca8')