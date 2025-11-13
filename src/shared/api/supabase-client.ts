import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ehypockmfzebouteiihk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoeXBvY2ttZnplYm91dGVpaWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjQ2ODMsImV4cCI6MjA3ODEwMDY4M30.WrRr7lTXp66JOaP-cbu3C6aFDfRS7EFTyIT1tdbHSIk'

export const supabase = createClient(supabaseUrl, supabaseKey)