import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { USER_TOURNAMENT_MATCHES, USER_SUBMIT_SCORE } from '../../services/apiRoutes';

const ActiveMatchHub = ({ tournamentId, onBack }) => {
  const [hubData, setHubData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [uploadData, setUploadData] = useState({});
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get(USER_TOURNAMENT_MATCHES(tournamentId));
        setHubData(response.data);
      } catch (error) {
        console.error("Failed to load match hub", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [tournamentId]);

  const handleInputChange = (matchId, field, value) => {
    setUploadData(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [field]: value }
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (match) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append('tournament_id', tournamentId);
    formData.append('match_id', match.match_id);
    
    // Append the correct fields based on game type
    const matchData = uploadData[match.match_id] || {};
    if (match.type === '1v1') {
      formData.append('score', matchData.score || 0);
    } else if (match.type === 'br') {
      formData.append('kills', matchData.kills || 0);
      formData.append('rank', matchData.rank || 0);
    }

    if (file) {
      formData.append('proof_image', file);
    }

    try {
      await api.post(USER_SUBMIT_SCORE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Score submitted successfully! Awaiting Admin Review.');
      // Refresh the list to show the new status
      const response = await api.get(USER_TOURNAMENT_MATCHES(tournamentId));
      setHubData(response.data);
      setFile(null);
    } catch (error) {
      console.error("Submission failed", error);
      alert('Failed to submit scores.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-cyan-500 animate-pulse text-center p-10 font-bold uppercase tracking-widest text-xs">Initializing Match Hub...</div>;

  return (
    <div className="bg-[#0a0a0c] border border-cyan-900/50 rounded-xl p-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h2 className="text-xl font-black text-white uppercase tracking-widest">
          {hubData.tournament_name} <span className="text-cyan-500 text-sm">/ Mission Control</span>
        </h2>
        <button onClick={onBack} className="text-gray-500 hover:text-white uppercase font-bold text-xs tracking-widest transition-colors">
          &larr; Return to Dashboard
        </button>
      </div>

      {/* MATCH LIST */}
      <div className="space-y-6">
        {hubData.matches.length === 0 ? (
          <p className="text-gray-500 italic text-sm">No matches assigned to you yet.</p>
        ) : (
          hubData.matches.map((match) => (
            <div key={match.match_id} className="border border-gray-800 bg-black/40 rounded-lg p-5">
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-cyan-400 uppercase tracking-widest">{match.round_name}</h3>
                <span className={`px-2 py-1 text-[10px] font-black uppercase rounded tracking-widest ${
                  match.status === 'LIVE' ? 'bg-green-500/10 text-green-500 border border-green-500/50' :
                  match.status === 'AWAITING_REVIEW' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/50' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {match.status}
                </span>
              </div>

              {match.type === '1v1' && (
                <p className="text-gray-300 mb-4 font-bold uppercase text-sm tracking-wider">
                  Target: <span className="text-red-400">{match.opponent}</span>
                </p>
              )}

              {/* UPLOAD FORM (Only show if LIVE and requires proof) */}
              {match.status === 'LIVE' && match.requires_proof ? (
                <div className="bg-gray-900/50 p-4 rounded border border-gray-800 space-y-4">
                  
                  {/* Dynamic Inputs based on Game Type */}
                  <div className="flex gap-4">
                    {match.type === '1v1' ? (
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Your Score</label>
                        <input type="number" className="w-full bg-black border border-gray-700 rounded p-2 text-white" 
                          onChange={(e) => handleInputChange(match.match_id, 'score', e.target.value)} />
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Total Kills</label>
                          <input type="number" className="w-full bg-black border border-gray-700 rounded p-2 text-white" 
                            onChange={(e) => handleInputChange(match.match_id, 'kills', e.target.value)} />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Placement Rank</label>
                          <input type="number" className="w-full bg-black border border-gray-700 rounded p-2 text-white" 
                            onChange={(e) => handleInputChange(match.match_id, 'rank', e.target.value)} />
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Screenshot Evidence</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-cyan-500/10 file:text-cyan-500 hover:file:bg-cyan-500/20" />
                  </div>

                  <button 
                    onClick={() => handleSubmit(match)}
                    disabled={submitting || !file}
                    className="w-full mt-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs font-black uppercase py-3 rounded transition-colors tracking-widest"
                  >
                    {submitting ? 'Transmitting...' : 'Submit Operation Result'}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic mt-2">
                  {match.status === 'AWAITING_REVIEW' ? 'Evidence transmitted. Awaiting admin verification.' : 'Match is not currently open for submissions.'}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveMatchHub;