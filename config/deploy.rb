set :application, 'erdman'
set :deploy_to, "/net/deploy/blake/#{fetch(:stage)}/#{fetch(:application)}"

set :branch, 'py3'

set :repo_url, 'https://github.com/blakearchive/erdman.git'

set :linked_files, %w[server/config.py]
set :solrUrl, ''

set :format, :pretty
set :log_level, :debug
set :pty, true

set :keep_releases, 5

set :index_solr, ask('Index solr docs (y/n):')

namespace :deploy do

  desc 'Restart Solr'
  task :restartSolr do
    on roles(:app) do |h|
      info 'restarting solr service'
      execute :curl, "'#{fetch(:solrUrl)}:8983/solr/admin/cores?action=RELOAD&core=erdman'"
    end
  end

  desc 'Index Solr'
  task :seed do
    on roles(:app) do |h|
      info 'Seeding Solr'
      within "#{current_path}/scripts" do
        execute :python, "transform.py", "'#{fetch(:solrUrl)}:8983/solr/erdman'"
      end
    end
  end

end

after 'deploy:finishing', 'deploy:cleanup'

if fetch(:index_solr) == 'y'
  after 'deploy:cleanup', 'deploy:seed'
end

#after 'deploy:cleanup', 'deploy:restartSolr'
#after 'deploy:cleanup', 'deploy:restartPython'
