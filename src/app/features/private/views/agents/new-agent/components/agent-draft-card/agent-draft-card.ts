import { Component, Input, output } from '@angular/core';
import { environment } from '@environments/environment';
import { AgentDraft } from 'src/app/features/private/interfaces/agents/agent-draft.interface';
import { Agent } from 'src/app/features/private/interfaces/agents/agents.interface';
import { TertiaryIconButton } from "src/app/shared/components/tertiary-icon-button/tertiary-icon-button";

@Component({
  selector: 'app-agent-draft-card',
  imports: [TertiaryIconButton],
  templateUrl: './agent-draft-card.html',
  styles: ``,
})
export class AgentDraftCard {
  @Input() agent: AgentDraft | null = null;
  agentDraft = output<AgentDraft>();

  storageUrl = environment.storageUrl;

  editAgentDraft(agent: AgentDraft){
    this.agentDraft.emit(agent);
  }
}
