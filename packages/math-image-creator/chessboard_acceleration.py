from manim import *

class ChessboardAcceleration(Scene):
    def construct(self):
        # Create chessboard grid
        board = VGroup()
        for i in range(8):
            for j in range(8):
                square = Square(side_length=0.6)
                square.move_to([j*0.6 - 2.1, 2.1 - i*0.6, 0])
                if (i + j) % 2 == 0:
                    square.set_fill(WHITE, opacity=0.8)
                else:
                    square.set_fill(BLACK, opacity=0.8)
                square.set_stroke(BLACK, width=1)
                board.add(square)
        
        # Scale and position the board
        board.scale(0.8)
        board.shift(DOWN * 0.5)
        
        # Add board to scene
        self.add(board)
        
        # Title
        title = Text("Experiencing the Acceleration", font_size=36)
        title.to_edge(UP)
        self.add(title)
        
        # Cumulative total display
        cumulative_total = 0
        total_display = Text(f"Total grains: {cumulative_total}", font_size=24)
        total_display.to_edge(UP).shift(DOWN * 0.8)
        self.add(total_display)
        
        # Flash through mid-section squares (squares 5-11)
        flash_text = Text("Quickly filling squares 5-11...", font_size=20, color=YELLOW)
        flash_text.to_edge(DOWN)
        self.play(Write(flash_text))
        
        # Flash animation for squares 5-11
        for square_num in range(5, 12):
            # Calculate position on board (row, col)
            row = (square_num - 1) // 8
            col = (square_num - 1) % 8
            
            # Create small pile
            grains = square_num ** 2
            cumulative_total += grains
            
            # Position on the board square
            pile_pos = [col*0.6*0.8 - 2.1*0.8, (2.1 - row*0.6)*0.8 - 0.5, 0]
            
            # Create small sand pile
            pile = Circle(radius=0.1 + square_num * 0.01, color=YELLOW, fill_opacity=0.8)
            pile.move_to(pile_pos)
            
            self.play(FadeIn(pile), run_time=0.3)
            
            # Update total
            new_total = Text(f"Total grains: {cumulative_total}", font_size=24)
            new_total.to_edge(UP).shift(DOWN * 0.8)
            self.play(Transform(total_display, new_total), run_time=0.2)
        
        self.play(FadeOut(flash_text))
        self.wait(0.5)
        
        # Square 12
        square_12_grains = 144
        cumulative_total += square_12_grains
        
        # Highlight square 12 (row 1, col 4)
        highlight_12 = Square(side_length=0.6*0.8, color=RED, fill_opacity=0.3)
        highlight_12.move_to([3*0.6*0.8 - 2.1*0.8, (2.1 - 1*0.6)*0.8 - 0.5, 0])
        
        grains_12_text = MathTex("12^2 = 144", " grains", font_size=32, color=BLUE)
        grains_12_text.to_edge(DOWN)
        
        # Larger pile for square 12
        pile_12 = Circle(radius=0.25, color=YELLOW, fill_opacity=0.9)
        pile_12.move_to([3*0.6*0.8 - 2.1*0.8, (2.1 - 1*0.6)*0.8 - 0.5, 0])
        
        self.play(FadeIn(highlight_12))
        self.play(Write(grains_12_text))
        self.play(FadeIn(pile_12))
        
        # Update total
        new_total = Text(f"Total grains: {cumulative_total}", font_size=24)
        new_total.to_edge(UP).shift(DOWN * 0.8)
        self.play(Transform(total_display, new_total))
        self.wait(1)
        
        self.play(FadeOut(highlight_12), FadeOut(grains_12_text))
        
        # Square 20
        square_20_grains = 400
        cumulative_total += square_20_grains
        
        # Highlight square 20 (row 2, col 4)
        highlight_20 = Square(side_length=0.6*0.8, color=RED, fill_opacity=0.3)
        highlight_20.move_to([3*0.6*0.8 - 2.1*0.8, (2.1 - 2*0.6)*0.8 - 0.5, 0])
        
        grains_20_text = MathTex("20^2 = 400", " grains", font_size=32, color=BLUE)
        grains_20_text.to_edge(DOWN)
        
        # Much larger pile for square 20
        pile_20 = Circle(radius=0.35, color=YELLOW, fill_opacity=0.9)
        pile_20.move_to([3*0.6*0.8 - 2.1*0.8, (2.1 - 2*0.6)*0.8 - 0.5, 0])
        
        self.play(FadeIn(highlight_20))
        self.play(Write(grains_20_text))
        self.play(FadeIn(pile_20))
        
        # Update total
        new_total = Text(f"Total grains: {cumulative_total}", font_size=24)
        new_total.to_edge(UP).shift(DOWN * 0.8)
        self.play(Transform(total_display, new_total))
        self.wait(1)
        
        self.play(FadeOut(highlight_20), FadeOut(grains_20_text))
        
        # Square 30
        square_30_grains = 900
        cumulative_total += square_30_grains
        
        # Highlight square 30 (row 3, col 6)
        highlight_30 = Square(side_length=0.6*0.8, color=RED, fill_opacity=0.3)
        highlight_30.move_to([5*0.6*0.8 - 2.1*0.8, (2.1 - 3*0.6)*0.8 - 0.5, 0])
        
        grains_30_text = MathTex("30^2 = 900", " grains", font_size=32, color=BLUE)
        grains_30_text.to_edge(DOWN)
        
        # Very large pile for square 30 - spilling over
        pile_30_main = Circle(radius=0.45, color=YELLOW, fill_opacity=0.9)
        pile_30_main.move_to([5*0.6*0.8 - 2.1*0.8, (2.1 - 3*0.6)*0.8 - 0.5, 0])
        
        # Additional smaller piles to show spillover
        pile_30_spill1 = Circle(radius=0.15, color=YELLOW, fill_opacity=0.7)
        pile_30_spill1.move_to([5*0.6*0.8 - 2.1*0.8 + 0.3, (2.1 - 3*0.6)*0.8 - 0.5, 0])
        
        pile_30_spill2 = Circle(radius=0.12, color=YELLOW, fill_opacity=0.7)
        pile_30_spill2.move_to([5*0.6*0.8 - 2.1*0.8 - 0.3, (2.1 - 3*0.6)*0.8 - 0.5 + 0.2, 0])
        
        pile_30_group = VGroup(pile_30_main, pile_30_spill1, pile_30_spill2)
        
        self.play(FadeIn(highlight_30))
        self.play(Write(grains_30_text))
        self.play(FadeIn(pile_30_group))
        
        # Update total with emphasis
        new_total = Text(f"Total grains: {cumulative_total}", font_size=28, color=RED)
        new_total.to_edge(UP).shift(DOWN * 0.8)
        self.play(Transform(total_display, new_total))
        
        # Add emphasis text
        emphasis_text = Text("The growth is accelerating rapidly!", font_size=24, color=GREEN)
        emphasis_text.next_to(grains_30_text, UP)
        self.play(Write(emphasis_text))
        
        self.wait(2)
        
        # Final display showing the rapid increase
        final_message = Text("Each square contains exponentially more grains!", 
                           font_size=20, color=BLUE)
        final_message.to_edge(DOWN).shift(UP * 0.5)
        
        self.play(
            FadeOut(grains_30_text),
            FadeOut(emphasis_text),
            Write(final_message)
        )
        
        self.wait(3)