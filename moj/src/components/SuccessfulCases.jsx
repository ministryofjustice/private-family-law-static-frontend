import * as React from 'react';
import './SuccessfulCases.css';

export default function SuccessfulCases() {
  return (
    <div className="successfulCases">
      <h1 className='largeText'>Successful cases like yours</h1>
      <p>Emma, a 38-year-old mother of one child (aged 7), recently navigated a similar family law case involving separation from her partner. Initially, Emma was concerned about achieving fair custody arrangements and ensuring financial stability for her child.​</p>

      <h3 className="mediumText mt-3 mb-2">Key Steps in Emma's Case:​</h3>
      <ul>
        <li>Attended mediation sessions where a mutually agreeable parenting plan was established, granting Emma primary custody with regular weekend visits for the father.​</li>
        <li>Successfully negotiated child maintenance payments based on her ex-partner's financial disclosures.​</li>
        <li>Submitted all required financial and personal documents promptly, which helped expedite negotiations.​</li>
        <li>Worked closely with her legal team to prepare for the mediation, focusing on the child's best interests.​</li>
      </ul>

      <h3 className='mt-3 mb-2'>Outcome:​</h3>
      <p>Emma achieved a child arrangement that prioritised the child's needs, stability, and routine. She now feels confident in managing co-parenting responsibilities and maintaining a positive environment for her child.​</p>
    </div>
  );
}