server 'kensington.lib.unc.edu', roles: [:app], user: 'swallow'

set :stage, :test
set :solrUrl, 'http://kensington.lib.unc.edu'

namespace :deploy do
  desc 'Restart python'
  task :restartPython do
    on roles(:app) do |h|
      info 'restarting application'
      execute "touch /htdocs/wsgi/erdman.wsgi"
    end
  end
end

#after 'deploy:cleanup', 'deploy:restartPython'