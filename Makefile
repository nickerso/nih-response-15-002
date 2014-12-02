main.pdf: *.tex *.bib Makefile
	-pdflatex main
	-bibtex main
	-pdflatex main
	-pdflatex main
