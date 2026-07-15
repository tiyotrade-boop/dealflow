'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import DealFlowDashboard from '../components/DealFlowDashboard';
import Link from 'next/link';

// ... rest of the code