/**
 * Agent Harness for testing Real Estate Lead Qualification & Property Matching
 */
import { calculateLeadScore } from './score_lead_helper';

console.log('--- Real Estate Agent Harness Test ---');
const score = calculateLeadScore(12000000, 1, true, true);
console.log(`Test Lead Score Result: ${score}/100`);
