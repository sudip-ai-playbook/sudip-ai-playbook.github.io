import { describe, expect, it } from 'vitest'
import {
  addAgendaItem,
  addQuestionItem,
  addVoteOption,
  castVote,
  createEmptyWorkshop,
  removeAgendaItem,
  setVotingQuestion,
  tallyVotes,
} from './workshop.logic'

describe('workshop voting and agenda', () => {
  it('edits agenda and questions', () => {
    let session = createEmptyWorkshop('stage-1')
    session = addAgendaItem(session, 'Vote on options')
    expect(session.agenda.at(-1)).toBe('Vote on options')
    session = removeAgendaItem(session, session.agenda.length - 1)
    session = addQuestionItem(session, 'What is the risk?')
    expect(session.questions.at(-1)).toBe('What is the risk?')
  })

  it('tallies votes and prevents duplicate voter on same option', () => {
    let session = createEmptyWorkshop('stage-6')
    session = setVotingQuestion(session, 'Which use case?')
    session = addVoteOption(session, 'Copilot')
    session = addVoteOption(session, 'Search')
    const optionId = session.voting.options[0].id
    session = castVote(session, optionId, 'Alex')
    session = castVote(session, optionId, 'Alex')
    session = castVote(session, session.voting.options[1].id, 'Alex')
    const tally = tallyVotes(session)
    expect(tally[0].count).toBe(0)
    expect(tally[1].count).toBe(1)
  })
})
