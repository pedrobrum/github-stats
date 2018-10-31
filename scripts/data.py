import sys
import pandas as pd
import time

def main():

    infile = sys.argv[1]

    data = pd.read_csv(infile, delimiter=',')

    data.info()

    # years = []

    # for index, row in data.iterrows():
    #     year = "20" + row["created_at"][6:8]
    #     years.append(year)

    # data["year"] = years

    # result = data[data.year != "2007"]

    # result.info()
    # result.to_csv("repositories_stats.csv", sep=',', index=False)

    issues = {2008:{}, 2009:{}, 2010:{}, 2011:{}, 2012:{}, 2013:{},
                  2014:{}, 2015:{}, 2016:{}, 2017:{}}
    pull_requests = {2008:{}, 2009:{}, 2010:{}, 2011:{}, 2012:{}, 2013:{},
                  2014:{}, 2015:{}, 2016:{}, 2017:{}}
    repositories = {2008:{}, 2009:{}, 2010:{}, 2011:{}, 2012:{}, 2013:{},
                  2014:{}, 2015:{}, 2016:{}, 2017:{}}

    for index, row in data.iterrows():
        lang = row['language']
        year = row['year']
        if year == 2007:
            continue
        if lang in issues[year]:
            issues[year][lang] += row['num_issues']
        else:
            issues[year][lang] = row['num_issues']

        if lang in pull_requests[year]:
            pull_requests[year][lang] += row['num_pull_requests']
        else:
            pull_requests[year][lang] = row['num_pull_requests']

        if lang in repositories[year]:
            repositories[year][lang] += 1
        else:
            repositories[year][lang] = 1

    tuples = []

    for year in issues:
        for lang in issues[year]:
            tuples.append((year, lang, issues[year][lang], pull_requests[year][lang],
                           repositories[year][lang]))

    col_names = ("year", "language", "num_issues", "pull_requests", "repositories")
    frame = pd.DataFrame.from_records(tuples, columns=col_names)

    frame.info()
    frame.to_csv("repositories_stats2.csv", sep=',', index=False)


if __name__ == "__main__":
    start_time = time.time()
    main()
    print("--- %s minutes ---" % ((time.time() - start_time)/60))
