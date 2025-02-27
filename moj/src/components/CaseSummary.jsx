import * as React from 'react';
import './CaseSummary.css';

export default function CaseSummary() {
  return (
    <div className="caseSummary">
      <h3 className="mt-4">Your case summary</h3>

      <div className="caseTitle">
        <h4 className='mt-3 mb-1'>Title</h4>
        <ul>
          <li>
            <p>
              <span class="title">Case Name:</span>
              <span>Include the full name of the case (e.g., Brown v. Board of Education).</span>
            </p>
          </li>
          <li>
            <p>
              <span class="title">Citation:</span>
              <span>Provide the legal citation (e.g., 347 U.S. 483 (1954)).</span>
            </p>
          </li>
        </ul>
      </div>
      <div className="caseIntroduction">
        <h4 className='mt-3 mb-1'>Introduction</h4>
        <ul>
          <li>
            <p>
              <span class="title">Background:</span>
              <span>Briefly introduce the context and background of the case.</span>
            </p>
          </li>
          <li>
            <p>
              <span class="title">Parties Involved: </span>
              <span>Name the parties involved in the case (plaintiff vs. defendant).</span>
            </p>
          </li>
        </ul>
      </div>
      <div className="caseKeyFacts">
        <h4 className='mt-3 mb-1'>Key Facts</h4>
        <ul>
          <li>
            <p>
              <span class="title">Situation Overview:</span>
              <span>Outline the key facts and events leading up to the legal dispute.</span>
            </p>
          </li>
          <li>
            <p>
              <span class="title">Relevant Details:</span>
              <span>Highlight any specific details that are crucial to understanding the case's context.</span>
            </p>
          </li>
        </ul>
      </div>
      <div className="caseLegalIssues">
      <h4 className='mt-3 mb-1'>Legal Issues</h4>
        <ul>
          <li>
            <p>
              <span class="title">Questions at Hand:</span>
              <span>Identify the main legal questions or issues that the court needed to resolve.</span>
            </p>
          </li>
        </ul>
      </div>
      <div className="caseArgumentsPresented">
        <h4 className='mt-3 mb-1'>Arguments presented</h4>
        <ul>
          <li>
            <p>
              <span class="title">Plaintiff's Arguments:</span>
              <span> Summarize the main arguments or claims made by the plaintiff.</span>
            </p>
          </li>
          <li>
            <p>
              <span class="title">Defendant's Arguments:</span>
              <span> Summarize the main arguments or claims made by the defendant.</span>
            </p>
          </li>
        </ul>
      </div>
      <div className="caseDecisionAndRationale">
        <h4 className='mt-3 mb-1'>Decision and Rationale</h4>
        <ul>
          <li>
            <p>
              <span class="title">Court's Decision:</span>
              <span>State the outcome of the case (who won and the verdict).</span>
            </p>
          </li>
          <li>
            <p>
              <span class="title">Legal Reasoning:</span>
              <span>Explain the court's reasoning and the legal principles applied in reaching its decision.</span>
            </p>
          </li>
        </ul>
      </div>
      <div className="caseSignificance">
        <h4 className='mt-3 mb-1'>Significance of the Case</h4>
        <ul>
          <li>
            <p>
              <span class="title">Implications:</span>
              <span>Discuss the case's implications for future legal interpretations, law, or society.</span>
            </p>
          </li>
          <li>
            <p>
              <span class="title">Precedents Set:</span>
              <span> If applicable, mention any legal precedents the case established.</span>
            </p>
          </li>
        </ul>
      </div>
      <div className="caseConclusion">
        <h4 className='mt-3 mb-1'>Conclusion</h4>
        <ul>
        <li>
            <p>
              <span class="title">Summary:</span>
              <span>Conclude with a brief recap of the case's importance and its impact on the legal landscape.</span>
            </p>
          </li>
        </ul>
      </div>
      <div className="caseReferences">
        <h4 className='mt-3 mb-1'>References</h4>
        <ul>
          <li>
            <p>
              <span class="title">Sources:</span>
              <span> List any additional sources or references used in preparing the case summary.</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}