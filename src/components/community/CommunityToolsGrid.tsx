import { Link } from 'react-router';
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { communityTools } from '../../data/communityTools';

const statusClass = {
  Live: 'tool-status tool-status-live',
  Researching: 'tool-status tool-status-researching',
  Planned: 'tool-status tool-status-planned',
};

export default function CommunityToolsGrid({
  limit,
}: {
  limit?: number;
}) {
  const tools = limit ? communityTools.slice(0, limit) : communityTools;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {tools.map(tool => {
        const Icon = LucideIcons[
          tool.icon as keyof typeof LucideIcons
        ] as React.ComponentType<{ className?: string }>;

        const destination =
          tool.href ||
          `/get-involved?type=idea&tool=${encodeURIComponent(tool.id)}#submission`;

        return (
          <Link key={tool.id} to={destination} className="community-tool-card">
            <div className="flex items-start justify-between gap-3">
              <div className="community-tool-icon">
                {Icon && <Icon className="h-5 w-5" />}
              </div>
              <span className={statusClass[tool.status]}>{tool.status}</span>
            </div>
            <div className="mt-5">
              <div className="text-xs font-bold text-gray-400 mb-1">
                {String(tool.priority).padStart(2, '0')}
              </div>
              <h3 className="text-lg font-extrabold text-gray-950">{tool.name}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{tool.summary}</p>
            </div>
            <div className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              {tool.status === 'Planned' ? 'Suggest or contribute' : 'Open'}
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
